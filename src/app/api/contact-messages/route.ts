

import "server-only";

import { NextResponse } from "next/server";
import { createPublicContactTicket, publicContactSchema } from "@/lib/support/support-hub";


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

  const parsed = publicContactSchema.safeParse(raw);

  if (!parsed.success) {
    return badRequest("validation_failed");
  }

  try {
    const ticket = await createPublicContactTicket(parsed.data);
    return NextResponse.json({ ok: true, ticket }, { status: 201 });
  } catch (error) {
    console.error("[contact-messages] support ticket insert failed:", error);
    return NextResponse.json(
      { error: "db_insert_failed" },
      { status: 502 },
    );
  }
}
