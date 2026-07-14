import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupportIdentity, isAuthorizedSupportOperator, supportStatuses, updateTicket } from "@/lib/support/support-hub";
const schema = z.object({ assignToMe: z.boolean().optional(), status: z.enum(supportStatuses).optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const identity = await getSupportIdentity(userId);
  if (!identity || !isAuthorizedSupportOperator(identity)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  try { return NextResponse.json({ ticket: await updateTicket(identity, (await params).id, parsed.data) }); }
  catch (error) { console.error("[operator/support] update", error); return NextResponse.json({ error: "support_unavailable" }, { status: 502 }); }
}
