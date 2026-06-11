/**
 * POST /api/calendly-webhook
 * Called by Calendly when someone books a demo.
 * 1. Verifies the webhook signature (skipped if CALENDLY_WEBHOOK_SECRET not set)
 * 2. Parses invitee info + custom question answers (phone, company, pain point)
 * 3. Creates Loops contact
 * 4. Scores lead with Claude
 * 5. Updates Loops contact with score/tier
 * 6. Fires demoBooked + demoLeadQualified events
 * 7. Logs to Google Sheets + sends Telegram notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  painPoint: string;
  scheduledAt: string;
}

interface ScoringResult {
  score: number;
  tier: 'hot' | 'warm' | 'cold';
  notes: string;
  companyIntel: string;
  personIntel: string;
  companyResources: string[];
  personResources: string[];
}

// ─── Signature Verification ───────────────────────────────────────────────────
function verifyCalendlySignature(rawBody: string, signature: string, secret: string): boolean {
  const parts = Object.fromEntries(
    signature.split(',').map(part => part.split('=') as [string, string])
  );

  const timestamp = parts['t'];
  const v1 = parts['v1'];

  if (!timestamp || !v1) return false;

  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp));
  if (age > 300) return false;

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('base64');

  try {
    return timingSafeEqual(Buffer.from(v1, 'base64'), Buffer.from(expected, 'base64'));
  } catch {
    return false;
  }
}

// ─── Parse Calendly payload ───────────────────────────────────────────────────
function parsePayload(payload: any): LeadData | null {
  // Make format: flat object with source = 'make'
  if (payload?.source === 'make') {
    const email = payload?.email;
    if (!email) return null;

    const fullName: string = payload?.name ?? '';
    const [firstName = '', ...rest] = fullName.trim().split(' ');

    return {
      firstName: payload?.firstName || firstName,
      lastName: payload?.lastName || rest.join(' '),
      email,
      phone: payload?.phone ?? '',
      companyName: payload?.companyName ?? '',
      painPoint: payload?.painPoint ?? '',
      scheduledAt: payload?.scheduledAt ?? '',
    };
  }

  // Native Calendly format
  const invitee = payload?.invitee;
  const email = invitee?.email;
  const fullName: string = invitee?.name ?? '';
  const scheduledAt: string = payload?.scheduled_event?.start_time ?? '';

  if (!email) return null;

  const [firstName = '', ...rest] = fullName.trim().split(' ');
  const lastName = rest.join(' ');

  // Parse custom question answers
  const qa: { question: string; answer: string }[] = payload?.questions_and_answers ?? [];
  const find = (keyword: string) =>
    qa.find(q => q.question.toLowerCase().includes(keyword.toLowerCase()))?.answer ?? '';

  return {
    firstName,
    lastName,
    email,
    phone: find('phone'),
    companyName: find('company'),
    painPoint: find('challenge') || find('pain') || find('hr'),
    scheduledAt,
  };
}

// ─── AI Lead Scoring (Tavily + Claude) ───────────────────────────────────────
async function scoreLeadWithIntel(data: LeadData): Promise<ScoringResult> {
  const tavilyKey = process.env.TAVILY_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!tavilyKey || !anthropicKey) throw new Error('Missing TAVILY_API_KEY or ANTHROPIC_API_KEY');

  // Step 1: Search for company + person in parallel
  const companyQuery = data.companyName
    ? `${data.companyName} Philippines company`
    : `${data.email.split('@')[1]} company Philippines`;
  const personQuery = `"${data.firstName} ${data.lastName}" "${data.companyName || data.email.split('@')[1]}" LinkedIn Philippines`;

  const tavilySearch = (query: string) =>
    fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: tavilyKey,
        query,
        search_depth: 'basic',
        max_results: 3,
        include_answer: true,
      }),
    }).then(r => r.ok ? r.json() : null);

  const [companyTavily, personTavily] = await Promise.all([
    tavilySearch(companyQuery),
    tavilySearch(personQuery),
  ]);

  const buildContext = (data: any) => [
    data?.answer ? `Summary: ${data.answer}` : '',
    ...(data?.results ?? []).map((r: { title: string; content: string; url: string }) =>
      `Source: ${r.title}\n${r.content}\nURL: ${r.url}`
    ),
  ].filter(Boolean).join('\n\n');

  const searchContext = buildContext(companyTavily);
  const personContext = buildContext(personTavily);

  const companyResources: string[] = (companyTavily?.results ?? [])
    .map((r: { url: string }) => r.url)
    .filter(Boolean);
  const personResources: string[] = (personTavily?.results ?? [])
    .map((r: { url: string }) => r.url)
    .filter(Boolean);

  // Step 2: Ask Claude to score + summarize intel
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: anthropicKey });

  const prompt = `You are a sales intelligence analyst for YAHSHUA HRIS, a Philippine HR and payroll software company.

A prospect just booked a demo. Here is their info:
- Name: ${data.firstName} ${data.lastName}
- Company: ${data.companyName || '(not provided)'}
- Email: ${data.email}
- Phone: ${data.phone || '(not provided)'}
- HR challenge: ${data.painPoint || '(not provided)'}
- Demo scheduled: ${data.scheduledAt || '(not provided)'}

Company research:
---
${searchContext || 'No results found.'}
---

Person research (the one who booked):
---
${personContext || 'No results found.'}
---

Based on this, return a JSON object with these exact fields. All fields are required and must never be empty strings:
{
  "score": <number 1-10, likelihood to buy YAHSHUA HRIS>,
  "tier": <"hot" | "warm" | "cold">,
  "notes": <1 short sentence only — just the scoring rationale: why hot/warm/cold based on email domain and pain point. Do NOT include company background here.>,
  "companyIntel": <3-5 sentences about the company: what they do, industry, estimated size, relevant business context for the sales team. Use search results if available; otherwise use your general knowledge. Never leave this empty.>,
  "personIntel": <2-3 sentences about the person who booked. Use search results if available. If not found, infer from signals: business vs personal email, the fact they booked themselves (likely decision-maker or influencer), their name, and their company role context. Never leave this empty.>
}

Scoring guide:
- Hot (7-10): Established company, business email, urgent HR pain (payroll, DOLE compliance, headcount growth)
- Warm (4-6): Growing company or moderate HR needs
- Cold (1-3): Early stage, personal email, vague pain point

Return only valid JSON, no explanation outside the JSON.`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
  console.log('Claude raw response:', raw);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude returned no valid JSON');

  const result = JSON.parse(jsonMatch[0]);

  return {
    score: Math.min(10, Math.max(1, Math.round(result.score))),
    tier: ['hot', 'warm', 'cold'].includes(result.tier) ? result.tier : result.score >= 7 ? 'hot' : result.score >= 4 ? 'warm' : 'cold',
    notes: result.notes ?? '',
    companyIntel: result.companyIntel ?? '',
    personIntel: result.personIntel ?? '',
    companyResources,
    personResources,
  };
}

// ─── Rule-based Lead Scoring (fallback) ──────────────────────────────────────
function scoreLeadWithRules(data: LeadData): ScoringResult {
  let score = 1;
  const reasons: string[] = [];

  // Email domain signal (+3 for business, 0 for personal)
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'ymail.com'];
  const emailDomain = data.email.split('@')[1]?.toLowerCase() ?? '';
  if (!personalDomains.includes(emailDomain)) {
    score += 3;
    reasons.push(`business email (${emailDomain})`);
  } else {
    reasons.push('personal email');
  }

  // Company name signal (+2 for established-sounding companies)
  const companyKeywords = ['corp', 'inc', 'group', 'holdings', 'industries', 'enterprise', 'solutions', 'ltd', 'co.', 'phils', 'philippines'];
  const companyLower = data.companyName.toLowerCase();
  if (companyKeywords.some(k => companyLower.includes(k))) {
    score += 2;
    reasons.push('established company name');
  }

  // Pain point urgency (+3 for high fit, +2 for moderate, +0 for low)
  const painLower = data.painPoint.toLowerCase();
  if (painLower.includes('payroll') || painLower.includes('dole') || painLower.includes('compliance')) {
    score += 3;
    reasons.push('high-urgency pain point');
  } else if (painLower.includes('records') || painLower.includes('leave') || painLower.includes('attendance')) {
    score += 2;
    reasons.push('moderate-urgency pain point');
  } else {
    reasons.push('low-urgency pain point');
  }

  // Cap at 10
  score = Math.min(score, 10);

  const tier: 'hot' | 'warm' | 'cold' = score >= 7 ? 'hot' : score >= 4 ? 'warm' : 'cold';
  const notes = `Score ${score}/10 based on: ${reasons.join(', ')}. Pain point: "${data.painPoint}".`;

  return { score, tier, notes, companyIntel: '', personIntel: '', companyResources: [], personResources: [] };
}

// ─── Loops ────────────────────────────────────────────────────────────────────
async function createLoopsContact(data: LeadData) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) return;

  const contactFields = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    companyName: data.companyName,
    source: 'calendly',
    leadStatus: 'booked',
    painPoint: data.painPoint,
    demoBooked: true,
    demoScheduledAt: data.scheduledAt,
  };

  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(contactFields),
  });

  // If contact already exists, update instead
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (err?.message?.toLowerCase().includes('already')) {
      const updateRes = await fetch('https://app.loops.so/api/v1/contacts/update', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(contactFields),
      });
      if (!updateRes.ok) {
        const updateErr = await updateRes.json().catch(() => ({}));
        throw new Error(`Loops update error: ${JSON.stringify(updateErr)}`);
      }
      return updateRes.json();
    }
    throw new Error(`Loops create error: ${JSON.stringify(err)}`);
  }

  return res.json();
}

async function updateLoopsContact(email: string, fields: Record<string, unknown>) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) return;

  await fetch('https://app.loops.so/api/v1/contacts/update', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...fields }),
  });
}

async function sendLoopsEvent(email: string, eventName: string, properties: Record<string, unknown> = {}) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) return;

  await fetch('https://app.loops.so/api/v1/events/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, eventName, ...properties }),
  });
}

// ─── Facebook Conversions API ────────────────────────────────────────────────
async function sendMetaLeadEvent(data: LeadData) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!accessToken) return;

  const { createHash } = await import('crypto');
  const hash = (value: string) => createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

  const userData: Record<string, string> = {
    em: hash(data.email),
  };
  // Normalize phone to E.164 — prepend +63 if no country code present
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, '');
    const normalized = digits.startsWith('63') ? digits : `63${digits.replace(/^0/, '')}`;
    userData.ph = hash(normalized);
  }
  if (data.firstName) userData.fn = hash(data.firstName.toLowerCase());
  if (data.lastName) userData.ln = hash(data.lastName.toLowerCase());

  const eventTime = Math.floor(Date.now() / 1000);
  const body = {
    data: [
      {
        event_name: 'Lead',
        event_time: eventTime,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          lead_type: 'demo_booking',
          company_name: data.companyName,
          pain_point: data.painPoint,
        },
      },
      {
        event_name: 'Schedule',
        event_time: eventTime,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          lead_type: 'demo_booking',
          company_name: data.companyName,
          pain_point: data.painPoint,
        },
      },
    ],
    access_token: accessToken,
  };

  const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Meta CAPI error:', JSON.stringify(err));
  }
}

// ─── Google Sheets ────────────────────────────────────────────────────────────
async function appendToSheet(data: LeadData, scoring: ScoringResult | null) {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !sheetId) return;

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  })).toString('base64url');

  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const signature = sign.sign(privateKey, 'base64url');
  const jwt = `${header}.${claim}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const { access_token } = await tokenRes.json();

  const values = [[
    new Date().toISOString(),
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.companyName,
    data.painPoint,
    data.scheduledAt,
    'booked',
    scoring?.score ?? '',
    scoring?.tier ?? '',
    scoring?.notes ?? '',
    scoring?.companyIntel ?? '',
    scoring?.personIntel ?? '',
    (scoring?.companyResources ?? []).join(', '),
    (scoring?.personResources ?? []).join(', '),
  ]];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A:P:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    }
  );
}

// ─── Telegram ─────────────────────────────────────────────────────────────────
async function sendTelegramNotification(data: LeadData, scoring: ScoringResult | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const tierEmoji = scoring?.tier === 'hot' ? '🔥' : scoring?.tier === 'warm' ? '🟡' : '🧊';
  const bookedDate = data.scheduledAt
    ? new Date(data.scheduledAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    : 'TBD';

  const message =
    `📅 *Demo Booked via Calendly*\n\n` +
    `👤 *Name:* ${data.firstName} ${data.lastName}\n` +
    `🏢 *Company:* ${data.companyName}\n` +
    `📧 *Email:* ${data.email}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `😤 *Pain point:* ${data.painPoint}\n` +
    `🗓 *Scheduled:* ${bookedDate}\n\n` +
    (scoring
      ? `${tierEmoji} *Score:* ${scoring.score}/10 — *${scoring.tier.toUpperCase()}*\n📝 ${scoring.notes}` +
        (scoring.personIntel ? `\n\n👤 *Person Intel:*\n${scoring.personIntel}` : '') +
        (scoring.personResources?.length
          ? `\n\n🔗 *Person Sources:*\n${scoring.personResources.map(u => `• ${u}`).join('\n')}`
          : '') +
        (scoring.companyIntel ? `\n\n🔍 *Company Intel:*\n${scoring.companyIntel}` : '') +
        (scoring.companyResources?.length
          ? `\n\n🔗 *Company Sources:*\n${scoring.companyResources.map(u => `• ${u}`).join('\n')}`
          : '')
      : `_Scoring unavailable_`);

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
  });
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('Calendly-Webhook-Signature') ?? '';
  const secret = process.env.CALENDLY_WEBHOOK_SECRET ?? '';

  if (secret && !verifyCalendlySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (payload.source !== 'make' && payload.event !== 'invitee.created') {
    return NextResponse.json({ received: true });
  }

  const data = parsePayload(payload.source === 'make' ? payload : payload.payload);
  if (!data) {
    return NextResponse.json({ error: 'Missing invitee email' }, { status: 400 });
  }

  try {
    // Create contact in Loops
    await createLoopsContact(data);

    // Score lead with AI (Tavily research + Claude), fall back to rules if it fails
    let scoring: ScoringResult;
    try {
      scoring = await scoreLeadWithIntel(data);
    } catch (err) {
      console.warn('AI scoring failed, falling back to rules:', err);
      scoring = scoreLeadWithRules(data);
    }

    // Update Loops with score and fire both events
    await updateLoopsContact(data.email, {
      score: scoring.score,
      tier: scoring.tier,
      leadStatus: 'booked',
    });

    await Promise.all([
      sendLoopsEvent(data.email, 'yhrisdemoBooked', { scheduledAt: data.scheduledAt }),
      sendLoopsEvent(data.email, 'yhrisdemoLeadQualified', { score: scoring.score, tier: scoring.tier }),
    ]);

    await Promise.allSettled([
      appendToSheet(data, scoring),
      sendTelegramNotification(data, scoring),
      sendMetaLeadEvent(data),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
