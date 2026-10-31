import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request } from 'express';

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

@Controller('api')
export class ContactController {
  private readonly attempts = new Map<string, number[]>();

  @Post('contact')
  @HttpCode(200)
  async contact(
    @Body() body: ContactBody = {},
    @Req() request: Request,
  ) {
    if (typeof body.website === 'string' && body.website.trim()) {
      return { ok: true };
    }

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (name.length < 2 || name.length > 80) {
      throw new BadRequestException('Please enter a name between 2 and 80 characters.');
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
    ) {
      throw new BadRequestException('Please enter a valid email address.');
    }

    if (message.length < 10 || message.length > 5000) {
      throw new BadRequestException('Please enter a message between 10 and 5000 characters.');
    }

    this.checkRateLimit(request.ip ?? 'unknown');

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const to = process.env.CONTACT_TO_EMAIL?.trim() || 'yuta911f@gmail.com';
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Contact form is not configured yet.',
      );
    }

    const from =
      process.env.CONTACT_FROM_EMAIL?.trim() ||
      'Portfolio <onboarding@resend.dev>';
    const safeName = name.replace(/[\r\n]+/g, ' ');
    const text = `Name: ${safeName}\nEmail: ${email}\n\n${message}`;

    let response: Awaited<ReturnType<typeof fetch>>;
    try {
      response = await fetch('https://api.resend.com/emails', {
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
          text,
        }),
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new ServiceUnavailableException('Could not send the message.');
    }

    if (!response.ok) {
      throw new ServiceUnavailableException('Could not send the message.');
    }

    return { ok: true };
  }

  private checkRateLimit(ip: string): void {
    const now = Date.now();
    const recent = (this.attempts.get(ip) ?? []).filter(
      (timestamp) => now - timestamp < WINDOW_MS,
    );

    if (recent.length >= MAX_REQUESTS) {
      throw new HttpException(
        'Too many messages. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(now);
    this.attempts.set(ip, recent);

    if (this.attempts.size > 500) {
      for (const [key, timestamps] of this.attempts) {
        if (!timestamps.some((timestamp) => now - timestamp < WINDOW_MS)) {
          this.attempts.delete(key);
        }
      }
    }
  }
}
