/**
 * POST /api/calendly-webhook
 * Called by Calendly when someone books a demo.
 * 1. Verifies the webhook signature (skipped if CALENDLY_WEBHOOK_SECRET not set)
 * 2. Parses invitee info + custom question answers (phone, company, pain point)
 * 3. Computes lead assignment (70% Efie / 30% Mici, modulo on sheet count)
 * 4. Creates Loops contact
 * 5. Scores lead with Claude
 * 6. Updates Loops contact with score/tier
 * 7. Fires demoBooked + demoLeadQualified events
 * 8. Logs to Google Sheets + patches calendar event color + sends Telegram notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

// ─── Partner domains ──────────────────────────────────────────────────────────
const PARTNER_DOMAINS: Record<string, string> = {
  'globe.com.ph': 'Globe Telecom',
  'globe.com': 'Globe Telecom',
  'rcbc.com': 'RCBC',
  'rcbc.com.ph': 'RCBC',
  'pbbank.com.ph': 'Philippine Business Bank (PBB)',
  'pbb.com.ph': 'Philippine Business Bank (PBB)',
  'sterlingbankasia.com': 'Sterling Bank of Asia',
  'sterling.com.ph': 'Sterling Bank of Asia',
};

// ─── Assignee config ──────────────────────────────────────────────────────────
// 70/30 split: every 10 leads, 7 go to Efie (slots 0-6), 3 go to Mici (slots 7-9)
const ASSIGNEE_COLORS: Record<string, string> = {
  Efie: '7',  // Peacock (blue)
  Mici: '5',  // Sage (green)
};

function computeAssignee(assignedCount: number): 'Efie' | 'Mici' {
  return assignedCount % 10 < 7 ? 'Efie' : 'Mici';
}

// ─── Dedup cache ──────────────────────────────────────────────────────────────
const processedUris = new Map<string, number>();
const DEDUP_TTL_MS = 30 * 60 * 1000;

function isDuplicate(uri: string): boolean {
  const seen = processedUris.get(uri);
  if (!seen) return false;
  if (Date.now() - seen > DEDUP_TTL_MS) {
    processedUris.delete(uri);
    return false;
  }
  return true;
}

function markProcessed(uri: string) {
  processedUris.set(uri, Date.now());
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  service: string;
  employeeCount: string;
  currentProcess: string;
  painPoint: string;
  scheduledAt: string;
  eventUri?: string;
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
      service: payload?.service ?? '',
      employeeCount: payload?.employeeCount ?? '',
      currentProcess: payload?.currentProcess ?? '',
      painPoint: payload?.painPoint ?? '',
      scheduledAt: payload?.scheduledAt ?? '',
      eventUri: payload?.eventUri ?? '',
    };
  }

  // Native Calendly format
  const email = payload?.email;
  const fullName: string = payload?.name ?? '';
  const scheduledAt: string = payload?.scheduled_event?.start_time ?? '';

  if (!email) return null;

  const [firstName = '', ...rest] = fullName.trim().split(' ');
  const lastName = rest.join(' ');

  const qa: { question: string; answer: string }[] = payload?.questions_and_answers ?? [];
  const find = (keyword: string) =>
    qa.find(q => q.question.toLowerCase().includes(keyword.toLowerCase()))?.answer ?? '';

  return {
    firstName,
    lastName,
    email,
    phone: find('phone'),
    companyName: find('company'),
    service: find('service') || find('product') || find('avail'),
    employeeCount: find('employee') || find('headcount') || find('staff'),
    currentProcess: find('current') || find('process') || find('existing'),
    painPoint: find('challenge') || find('pain') || find('problem') || find('hr'),
    scheduledAt,
    eventUri: payload?.scheduled_event?.uri ?? '',
  };
}

// ─── Google Auth ──────────────────────────────────────────────────────────────
async function getGoogleAccessToken(scope: string): Promise<string | null> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!serviceAccountEmail || !privateKey) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: serviceAccountEmail,
    scope,
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
  return access_token ?? null;
}

// ─── AI Lead Scoring (Tavily + Claude) ───────────────────────────────────────
async function scoreLeadWithIntel(data: LeadData): Promise<ScoringResult> {
  const tavilyKey = process.env.TAVILY_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!tavilyKey || !anthropicKey) throw new Error('Missing TAVILY_API_KEY or ANTHROPIC_API_KEY');

  const fullName = `${data.firstName} ${data.lastName}`;
  const companyHint = data.companyName || data.email.split('@')[1];
  const emailUsername = data.email.split('@')[0];

  const companyQuery = data.companyName
    ? `${data.companyName} Philippines company`
    : `${data.email.split('@')[1]} company Philippines`;

  const personQuery1 = `"${fullName}" "${companyHint}" Philippines`;
  const personQuery2 = `"${emailUsername}" site:linkedin.com OR "${fullName}" site:linkedin.com "${companyHint}"`;

  type TavilyResult = { title: string; content: string; url: string };

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

  const [companyTavily, personTavily1, personTavily2] = await Promise.all([
    tavilySearch(companyQuery),
    tavilySearch(personQuery1),
    tavilySearch(personQuery2),
  ]);

  const nameLower = fullName.toLowerCase();
  const companyLower = companyHint.toLowerCase();

  const isValidPersonResult = (r: TavilyResult) => {
    const text = `${r.title} ${r.content}`.toLowerCase();
    return text.includes(nameLower) && text.includes(companyLower);
  };

  const allPersonResults: TavilyResult[] = [
    ...(personTavily1?.results ?? []),
    ...(personTavily2?.results ?? []),
  ];

  const validatedPersonResults = allPersonResults.filter(isValidPersonResult);
  const personValidated = validatedPersonResults.length > 0;

  const buildContext = (results: TavilyResult[], answer?: string) => [
    answer ? `Summary: ${answer}` : '',
    ...results.map(r => `Source: ${r.title}\n${r.content}\nURL: ${r.url}`),
  ].filter(Boolean).join('\n\n');

  const searchContext = buildContext(companyTavily?.results ?? [], companyTavily?.answer);
  const personContext = personValidated ? buildContext(validatedPersonResults) : '';

  const companyResources: string[] = (companyTavily?.results ?? []).map((r: TavilyResult) => r.url).filter(Boolean);
  const personResources: string[] = validatedPersonResults.map(r => r.url).filter(Boolean);

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: anthropicKey });

  const emailDomain = data.email.split('@')[1]?.toLowerCase() ?? '';
  const partnerName = PARTNER_DOMAINS[emailDomain] ?? null;
  const isPartner = partnerName !== null;
  const serviceLabel = data.service?.trim() || 'YAHSHUA HRIS';

  const prompt = `You are a sales intelligence analyst for YAHSHUA HRIS, a Philippine HR and payroll software company.

A ${isPartner ? `PARTNER REP from ${partnerName}` : 'prospect'} just booked a demo. Here is their info:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}${isPartner ? ` (${partnerName} partner)` : ''}
- Client company: ${data.companyName || '(not provided)'}
- Phone: ${data.phone || '(not provided)'}
- Service interested in: ${serviceLabel}
- Number of employees: ${data.employeeCount || '(not provided)'}
- Current HR/payroll process: ${data.currentProcess || '(not provided)'}
- HR challenge: ${data.painPoint || '(not provided)'}
- Demo scheduled: ${data.scheduledAt ? new Date(data.scheduledAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) + ' (Philippine Time)' : '(not provided)'}

${isPartner ? `IMPORTANT: This booking was made by a ${partnerName} partner rep on behalf of the client company listed above. The company field refers to their CLIENT, not ${partnerName} itself.\n\n` : ''}Company research (about the client company):
---
${searchContext || 'No results found.'}
---

Person research (the one who booked):
[${personValidated ? `VALIDATED — results confirmed to match "${fullName}" at "${companyHint}"` : `NOT VALIDATED — no search results confirmed this exact person at this company`}]
---
${personContext || 'No confirmed results found.'}
---

Based on this, return a JSON object with these exact fields. All fields are required and must never be empty strings:
{
  "score": <number 1-10, likelihood to buy YAHSHUA HRIS>,
  "tier": <"hot" | "warm" | "cold">,
  "notes": <2 sentences max. Sentence 1: scoring rationale — why hot/warm/cold based on the client company's profile, pain point, and employee count. Always reference the specific service they are interested in (${serviceLabel}) — do NOT substitute a different service name. Sentence 2: opportunity signal — estimated urgency, potential seat count or deal size, and one concrete action. ${isPartner ? `Flag this as a partner-sourced deal from ${partnerName} and suggest coordinating with the partner rep.` : ''} Do NOT include company background here.>,
  "companyIntel": <3-5 sentences about the CLIENT company (${data.companyName || 'the company listed'}): what they do, industry, estimated size, and context relevant to a ${serviceLabel} sale. Use search results if available; otherwise use general knowledge. Never leave this empty.>,
  "personIntel": <${isPartner
    ? `2-3 sentences describing this as a PARTNER booking. State clearly that ${data.firstName} ${data.lastName} is a rep from ${partnerName} — a YAHSHUA partner — who booked this demo on behalf of their client (${data.companyName || 'the listed company'}). Note what this means for the sales approach: this is a partner-led deal, coordinate with the ${partnerName} rep, treat the client company as the end buyer. Do not describe this person as a direct prospect.`
    : `2-3 sentences about the person who booked. ${personValidated ? `Search results above are pre-validated to match "${fullName}" at "${companyHint}" — you may use them.` : `Person research was NOT validated. Do NOT use any search results for person intel — infer only from available signals: business vs personal email, the fact they self-booked (likely evaluator or decision-maker), their name, their stated role context, pain points, and company type.`}`} Never leave this empty.>
}

Scoring guide:
- Hot (7-10): Established company, business email, 20+ employees, urgent pain point matching ${serviceLabel}${isPartner ? `, or partner-referred (partner referrals carry higher close rate)` : ''}
- Warm (4-6): Growing company, moderate needs, or fewer signals available
- Cold (1-3): Early stage, personal email, very few employees, vague pain point

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

  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'ymail.com'];
  const emailDomain = data.email.split('@')[1]?.toLowerCase() ?? '';
  if (!personalDomains.includes(emailDomain)) {
    score += 3;
    reasons.push(`business email (${emailDomain})`);
  } else {
    reasons.push('personal email');
  }

  const companyKeywords = ['corp', 'inc', 'group', 'holdings', 'industries', 'enterprise', 'solutions', 'ltd', 'co.', 'phils', 'philippines'];
  const companyLower = data.companyName.toLowerCase();
  if (companyKeywords.some(k => companyLower.includes(k))) {
    score += 2;
    reasons.push('established company name');
  }

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
    service: data.service,
    employeeCount: data.employeeCount,
    currentProcess: data.currentProcess,
    source: 'YHRIS Web Booking',
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
      console.log('Loops contact updated');
      return updateRes.json();
    }
    throw new Error(`Loops create error: ${JSON.stringify(err)}`);
  }

  console.log('Loops contact created');
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

  const userData: Record<string, string> = { em: hash(data.email) };
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
        custom_data: { lead_type: 'demo_booking', company_name: data.companyName, pain_point: data.painPoint },
      },
      {
        event_name: 'Schedule',
        event_time: eventTime,
        action_source: 'website',
        user_data: userData,
        custom_data: { lead_type: 'demo_booking', company_name: data.companyName, pain_point: data.painPoint },
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
async function getAssignedLeadCount(): Promise<number> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return 0;

  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/spreadsheets');
  if (!token) return 0;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!T:T`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return 0;
  const json = await res.json();
  const rows: string[][] = json.values ?? [];
  // Subtract header row, count non-empty assignee cells
  return Math.max(0, rows.slice(1).filter(r => r[0]?.trim()).length);
}

async function appendToSheet(data: LeadData, scoring: ScoringResult | null, assignee: string) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return;

  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/spreadsheets');
  if (!token) return;

  const values = [[
    new Date().toISOString(),
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.companyName,
    data.service,
    data.employeeCount,
    data.currentProcess,
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
    assignee,
  ]];

  const sheetsRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A:T:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    }
  );

  if (!sheetsRes.ok) {
    const err = await sheetsRes.json().catch(() => ({}));
    console.error('Google Sheets append error:', sheetsRes.status, JSON.stringify(err));
  } else {
    console.log('Google Sheets append success:', sheetsRes.status);
  }
}

// ─── Google Calendar ──────────────────────────────────────────────────────────
async function patchCalendarEventColor(scheduledAt: string, assignee: 'Efie' | 'Mici'): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId || !scheduledAt) return;

  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/calendar.events');
  if (!token) return;

  // Search in a 2-minute window around the booking start time
  const start = new Date(scheduledAt);
  const timeMin = new Date(start.getTime() - 60_000).toISOString();
  const timeMax = new Date(start.getTime() + 60_000).toISOString();

  const listRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!listRes.ok) {
    console.error('Calendar list error:', await listRes.text());
    return;
  }

  const { items } = await listRes.json();
  if (!items?.length) {
    console.warn('No calendar event found at', scheduledAt);
    return;
  }

  const eventId = items[0].id;
  const colorId = ASSIGNEE_COLORS[assignee];

  const patchRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ colorId }),
    }
  );

  if (!patchRes.ok) {
    console.error('Calendar patch error:', await patchRes.text());
  } else {
    console.log(`Calendar event ${eventId} colored for ${assignee} (colorId ${colorId})`);
  }
}

// ─── Cancellation: Sheet update + Telegram ────────────────────────────────────
async function updateSheetCancellation(email: string): Promise<string> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return '';

  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/spreadsheets');
  if (!token) return '';

  // Read D:T to find the row by email and grab the assignee (column T = index 16 in D:T)
  const readRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!D:T`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!readRes.ok) return '';
  const json = await readRes.json();
  const rows: string[][] = json.values ?? [];

  // Search from the bottom to match the most recent booking for this email
  let rowIndex = -1;
  for (let i = rows.length - 1; i > 0; i--) {
    if (rows[i][0]?.toLowerCase() === email.toLowerCase()) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    console.warn('Sheet row not found for cancellation:', email);
    return '';
  }

  const sheetRow = rowIndex + 1; // array is 0-indexed; row 1 is the header
  const assignee = rows[rowIndex][16] ?? ''; // T is index 16 in D:T range

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valueInputOption: 'RAW',
        data: [
          { range: `Leads!L${sheetRow}`, values: [['cancelled']] },
          { range: `Leads!T${sheetRow}`, values: [['']] },
        ],
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    console.error('Sheet cancellation update error:', JSON.stringify(err));
  } else {
    console.log(`Sheet row ${sheetRow} marked cancelled, assignee slot freed`);
  }

  return assignee;
}

async function sendTelegramCancellationAlert(data: LeadData, assignee: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const scheduledDate = data.scheduledAt
    ? new Date(data.scheduledAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    : 'TBD';

  const message =
    `❌ Demo Cancelled\n\n` +
    `👤 Name: ${data.firstName} ${data.lastName}\n` +
    `🏢 Company: ${data.companyName}\n` +
    `📧 Email: ${data.email}\n` +
    `🗓 Was scheduled: ${scheduledDate}\n` +
    (assignee ? `🎯 Was assigned to: ${assignee}\n` : '');

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  if (!tgRes.ok) {
    const err = await tgRes.json().catch(() => ({}));
    console.error('Telegram cancellation error:', JSON.stringify(err));
  } else {
    console.log('Telegram cancellation alert sent');
  }
}

// ─── Telegram ─────────────────────────────────────────────────────────────────
async function sendTelegramNotification(data: LeadData, scoring: ScoringResult | null, assignee: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const tierEmoji = scoring?.tier === 'hot' ? '🔥' : scoring?.tier === 'warm' ? '🟡' : '🧊';
  const bookedDate = data.scheduledAt
    ? new Date(data.scheduledAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })
    : 'TBD';

  const message =
    `📅 Demo Booked via Calendly\n\n` +
    `👤 Name: ${data.firstName} ${data.lastName}\n` +
    `🏢 Company: ${data.companyName}\n` +
    `📧 Email: ${data.email}\n` +
    `📞 Phone: ${data.phone || 'N/A'}\n` +
    (data.service ? `🛠 Service: ${data.service}\n` : '') +
    (data.employeeCount ? `👥 Employees: ${data.employeeCount}\n` : '') +
    (data.currentProcess ? `⚙️ Current process: ${data.currentProcess}\n` : '') +
    `😤 Pain point: ${data.painPoint}\n` +
    `🗓 Scheduled: ${bookedDate}\n` +
    `🎯 Assigned to: ${assignee}\n\n` +
    (scoring
      ? `${tierEmoji} Score: ${scoring.score}/10 — ${scoring.tier.toUpperCase()}\n📝 ${scoring.notes}` +
        (scoring.personIntel ? `\n\n👤 Person Intel:\n${scoring.personIntel}` : '') +
        (scoring.personResources?.length
          ? `\n\n🔗 Person Sources:\n${scoring.personResources.map(u => `• ${u}`).join('\n')}`
          : '') +
        (scoring.companyIntel ? `\n\n🔍 Company Intel:\n${scoring.companyIntel}` : '') +
        (scoring.companyResources?.length
          ? `\n\n🔗 Company Sources:\n${scoring.companyResources.map(u => `• ${u}`).join('\n')}`
          : '')
      : `Scoring unavailable`);

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  if (!tgRes.ok) {
    const err = await tgRes.json().catch(() => ({}));
    console.error('Telegram error:', JSON.stringify(err));
  } else {
    console.log('Telegram notification sent');
  }
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

  if (payload.event === 'invitee.cancelled') {
    const data = parsePayload(payload.payload);
    if (!data) return NextResponse.json({ received: true });
    const assignee = await updateSheetCancellation(data.email);
    await sendTelegramCancellationAlert(data, assignee);
    return NextResponse.json({ success: true, cancelled: true });
  }

  if (payload.source !== 'make' && payload.event !== 'invitee.created') {
    return NextResponse.json({ received: true });
  }

  const data = parsePayload(payload.source === 'make' ? payload : payload.payload);
  if (!data) {
    return NextResponse.json({ error: 'Missing invitee email' }, { status: 400 });
  }

  const dedupKey = data.eventUri || data.email;
  if (isDuplicate(dedupKey)) {
    console.log('Duplicate booking skipped:', dedupKey);
    return NextResponse.json({ received: true, skipped: 'duplicate' });
  }
  markProcessed(dedupKey);

  try {
    // Compute assignee before anything else — reads current sheet count
    const assignedCount = await getAssignedLeadCount();
    const assignee = computeAssignee(assignedCount);
    console.log(`Lead assignment: count=${assignedCount}, assignee=${assignee}`);

    await createLoopsContact(data);

    let scoring: ScoringResult;
    try {
      scoring = await scoreLeadWithIntel(data);
    } catch (err) {
      console.warn('AI scoring failed, falling back to rules:', err);
      scoring = scoreLeadWithRules(data);
    }

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
      appendToSheet(data, scoring, assignee),
      patchCalendarEventColor(data.scheduledAt, assignee),
      sendTelegramNotification(data, scoring, assignee),
      sendMetaLeadEvent(data),
    ]);

    return NextResponse.json({ success: true, assignee });
  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
