

import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";

import { ContactMessagesRepository } from "@/lib/repositories/contact-messages-repository";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  CONTACT_MESSAGE_CATEGORIES,
  type ContactMessage,
} from "@/types/contact-message";

const ContactMessageBodySchema = z.object({
  email: z.string().trim().min(3).max(254),
  subject: z.string().trim().min(1).max(200),
  category: z.enum(CONTACT_MESSAGE_CATEGORIES as readonly [string, ...string[]]).nullable().optional(),
  message: z.string().trim().min(1).max(5000),
});

const EMAIL_RE = /^.+@.+\..+$/;

function badRequest(reason: string) {
  return NextResponse.json({ error: reason }, { status: 400 });
}

export async function POST(request: Request) {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return badRequest("invalid_body");
  }

  const parsed = ContactMessageBodySchema.safeParse(raw);

  if (!parsed.success) {
    return badRequest("validation_failed");
  }

  const { email, subject, message } = parsed.data;
  const category = parsed.data.category ?? null;

  if (!EMAIL_RE.test(email)) {
    return badRequest("invalid_email");
  }

  if (!subject) {
    return badRequest("missing_subject");
  }

  if (!message) {
    return badRequest("missing_message");
  }

  const supabase = createAdminSupabaseClient();
  const repo = new ContactMessagesRepository(supabase);

  const result = await repo.create({
    senderEmail: email,
    subject,
    body: message,
    category: category as ContactMessage["category"],
  });

  if (!result.ok) {
    console.error("[contact-messages] insert failed:", result.error);
    return NextResponse.json(
      { error: "db_insert_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: result.data }, { status: 201 });
}
