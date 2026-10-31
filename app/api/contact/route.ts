import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REQUESTS) return false;

  recent.push(now);
  attempts.set(ip, recent);

  if (attempts.size > 500) {
    for (const [key, timestamps] of attempts) {
      if (!timestamps.some((timestamp) => now - timestamp < WINDOW_MS)) {
        attempts.delete(key);
      }
    }
  }

  return true;
}

export async function POST(request: Request) {
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid request.' },
      { status: 400 },
    );
  }

  if (!parsed || typeof parsed !== 'object') {
    return NextResponse.json(
      { message: 'Invalid request.' },
      { status: 400 },
    );
  }

  const body = parsed as ContactBody;

  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { message: 'Please enter a name between 2 and 80 characters.' },
      { status: 400 },
    );
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    return NextResponse.json(
      { message: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { message: 'Please enter a message between 10 and 5000 characters.' },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: 'Too many messages. Try again later.' },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { message: 'Contact form is not configured yet.' },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL?.trim() || 'yuta911f@gmail.com';
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    'Portfolio <onboarding@resend.dev>';
  const safeName = name.replace(/[\r\n]+/g, ' ');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry from ${safeName}`,
        text: `Name: ${safeName}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Could not send the message.' },
        { status: 503 },
      );
    }
  } catch {
    return NextResponse.json(
      { message: 'Could not send the message.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
