/**
 * POST /api/book-demo
 * 1. Creates contact in Loops.so
 * 2. Scores lead with Claude (company research + pain point analysis)
 * 3. Updates Loops contact with score/tier, fires demoLeadQualified event
 * 4. Logs lead to Google Sheets
 * 5. Sends Telegram notification
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface BookDemoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  painPoint: string;
}

interface ScoringResult {
  score: number;
  tier: 'hot' | 'warm' | 'cold';
  notes: string;
}

// ─── Claude Lead Scoring ───────────────────────────────────────────────────────
async function scoreLeadWithClaude(data: BookDemoPayload): Promise<ScoringResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a lead scoring specialist for YAHSHUA HRIS, a Philippine HR and payroll software targeting SMEs and mid-sized companies.

Score this lead 1-10 on likelihood to purchase. Use your knowledge about the company if you recognize it, and reason from the signals available.

Lead details:
- Name: ${data.firstName} ${data.lastName}
- Email: ${data.email}
- Company: ${data.companyName}
- Biggest pain point: ${data.painPoint}

Scoring criteria:
- Business email domain (not Gmail/Yahoo/Hotmail/Outlook personal) = +2 points
- Company name suggests mid-to-large size (Corp, Inc, Group, Holdings, Industries) = +2 points
- Pain point is urgent and directly solved by HRIS (payroll, DOLE compliance, attendance) = +2 points
- Company is recognizable as an established Philippine business = +2 points
- Personal email or no clear company signals = lower score

Pain point urgency guide:
- "Manual payroll & timekeeping" = very urgent, high fit
- "DOLE compliance & government reports" = urgent, high fit
- "Employee records & 201 files" = moderate urgency
- "Leave & attendance tracking" = moderate urgency
- "Still figuring it out" = low urgency, exploring

Respond with ONLY valid JSON, no other text:
{"score": <number 1-10>, "tier": "<hot|warm|cold>", "notes": "<2-3 sentence summary of why>"}

Tier guide: hot = 7-10, warm = 4-6, cold = 1-3`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(c => c.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response from Claude');

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Claude response');

  return JSON.parse(jsonMatch[0]) as ScoringResult;
}

// ─── Loops ────────────────────────────────────────────────────────────────────
async function createLoopsContact(data: BookDemoPayload) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) throw new Error('LOOPS_BOOKDEMO_API not set');

  const res = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      companyName: data.companyName,
      source: 'HRIS Website',
      leadStatus: 'pending_qualification',
      painPoint: data.painPoint,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Loops create error: ${JSON.stringify(err)}`);
  }

  return res.json();
}

async function updateLoopsContact(email: string, fields: Record<string, unknown>) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) return;

  await fetch('https://app.loops.so/api/v1/contacts/update', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, ...fields }),
  });
}

async function sendLoopsEvent(email: string, eventName: string, properties: Record<string, unknown> = {}) {
  const apiKey = process.env.LOOPS_BOOKDEMO_API;
  if (!apiKey) return;

  await fetch('https://app.loops.so/api/v1/events/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, eventName, ...properties }),
  });
}

// ─── Google Sheets ────────────────────────────────────────────────────────────
async function appendToSheet(data: BookDemoPayload, scoring: ScoringResult | null) {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    console.warn('Google Sheets env vars not set — skipping');
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(
    JSON.stringify({
      iss: serviceAccountEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

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
  const timestamp = new Date().toISOString();

  const values = [[
    timestamp,
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.companyName,
    data.painPoint,
    scoring ? 'qualified' : 'pending_qualification',
    scoring?.score ?? '',
    scoring?.tier ?? '',
    scoring?.notes ?? '',
  ]];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A:K:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );
}

// ─── Telegram ─────────────────────────────────────────────────────────────────
async function sendTelegramNotification(data: BookDemoPayload, scoring: ScoringResult | null) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram env vars not set — skipping');
    return;
  }

  const tierEmoji = scoring?.tier === 'hot' ? '🔥' : scoring?.tier === 'warm' ? '🟡' : '🧊';
  const message =
    `🔔 *New Demo Request*\n\n` +
    `👤 *Name:* ${data.firstName} ${data.lastName}\n` +
    `🏢 *Company:* ${data.companyName}\n` +
    `📧 *Email:* ${data.email}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `😤 *Pain point:* ${data.painPoint}\n\n` +
    (scoring
      ? `${tierEmoji} *Score:* ${scoring.score}/10 — *${scoring.tier.toUpperCase()}*\n📝 ${scoring.notes}`
      : `_Scoring pending_`);

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
  });
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: BookDemoPayload = await request.json();
    const { firstName, lastName, email, phone, companyName, painPoint } = body;

    if (!email || !firstName || !lastName || !phone || !companyName || !painPoint) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Step 1: Create Loops contact (critical — must succeed)
    await createLoopsContact(body);

    // Step 2: Score the lead with Claude
    let scoring: ScoringResult | null = null;
    try {
      scoring = await scoreLeadWithClaude(body);
    } catch (err) {
      console.error('Claude scoring failed:', err);
    }

    // Step 3: Update Loops contact with score and fire the sequence trigger
    if (scoring) {
      await updateLoopsContact(email, {
        score: scoring.score,
        tier: scoring.tier,
        leadStatus: 'qualified',
      });
      await sendLoopsEvent(email, 'demoLeadQualified', {
        score: scoring.score,
        tier: scoring.tier,
      });
    }

    // Step 4: Log to Sheets + Telegram in parallel (non-blocking failures)
    await Promise.allSettled([
      appendToSheet(body, scoring),
      sendTelegramNotification(body, scoring),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Book demo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
