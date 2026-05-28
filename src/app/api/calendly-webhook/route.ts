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

// ─── Rule-based Lead Scoring ──────────────────────────────────────────────────
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

  return { score, tier, notes };
}

// ─── Loops ────────────────────────────────────────────────────────────────────
async function createLoopsContact(data: LeadData) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) throw new Error('LOOPS_BOOKDEMO_API not set');

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
  ]];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A:L:append?valueInputOption=USER_ENTERED`,
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
      ? `${tierEmoji} *Score:* ${scoring.score}/10 — *${scoring.tier.toUpperCase()}*\n📝 ${scoring.notes}`
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

  if (payload.event !== 'invitee.created') {
    return NextResponse.json({ received: true });
  }

  const data = parsePayload(payload.payload);
  if (!data) {
    return NextResponse.json({ error: 'Missing invitee email' }, { status: 400 });
  }

  try {
    // Create contact in Loops
    await createLoopsContact(data);

    // Score lead with rules
    const scoring = scoreLeadWithRules(data);

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
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
