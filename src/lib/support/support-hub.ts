import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getRoleFromClerkMetadata } from "@/lib/auth";
import { sendSupportEmail } from "@/lib/email/support-email";
import { ProfilesRepository } from "@/lib/repositories/profiles-repository";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ClerkRoleMetadata, UserRole } from "@/types/roles";

export const supportCategories = ["parcel_data", "delivery_tracking", "billing", "account", "technical", "general"] as const;
export const supportStatuses = ["open", "assigned", "waiting_customer", "resolved", "closed"] as const;
export type SupportCategory = (typeof supportCategories)[number];
export type SupportStatus = (typeof supportStatuses)[number];
export type SupportActor = "client" | "assistant" | "operator" | "system";

export type SupportIdentity = {
  clerkUserId: string;
  profileId: string;
  email: string | null;
  name: string | null;
  role: UserRole;
};

const db = () => createAdminSupabaseClient() as never as {
  from: (table: string) => any;
};

export async function getSupportIdentity(clerkUserId: string): Promise<SupportIdentity | null> {
  const supabase = createAdminSupabaseClient();
  const profiles = new ProfilesRepository(supabase);
  const user = await currentUser();
  const email = user?.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress
    ?? user?.emailAddresses[0]?.emailAddress
    ?? null;
  const fullName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || null;
  const role = getRoleFromClerkMetadata(
    (user?.publicMetadata ?? null) as ClerkRoleMetadata | null,
    (user?.privateMetadata ?? null) as ClerkRoleMetadata | null,
  ) ?? "client";
  const profile = await profiles.findOrCreateByClerkUserId(clerkUserId, {
    clerkUserId,
    email: email ?? `${clerkUserId}@skysend.local`,
    fullName,
    role,
  });
  if (!profile.ok || !profile.data) return null;

  return {
    clerkUserId,
    profileId: profile.data.id,
    email: email ?? profile.data.email ?? null,
    name: profile.data.fullName,
    role: getRoleFromClerkMetadata(
      (user?.publicMetadata ?? null) as ClerkRoleMetadata | null,
      (user?.privateMetadata ?? null) as ClerkRoleMetadata | null,
    ) ?? profile.data.role,
  };
}

export function isSupportOperator(role: UserRole | null | undefined) {
  return role === "operator" || role === "suport";
}

export function isAuthorizedSupportOperator(identity: SupportIdentity | null | undefined) {
  return identity?.email?.trim().toLowerCase() === "operator@skysend.com";
}

export function priorityForSupportText(text: string): "normal" | "high" | "urgent" {
  const value = text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("ro-RO");
  if (/(locker|recuperare|blocat|blocata|blocata|blocaj)/u.test(value)) return "urgent";
  if (/(plata esuata|plata respinsa|payment failed|card respins)/u.test(value)) return "high";
  return "normal";
}

export function categoryFromContact(value: string | null | undefined): SupportCategory {
  const normalized = value?.toLocaleLowerCase("ro-RO") ?? "";
  if (/(colet|parcel)/u.test(normalized)) return "parcel_data";
  if (/(livrare|tracking|urm)/u.test(normalized)) return "delivery_tracking";
  if (/(plat|factur)/u.test(normalized)) return "billing";
  if (/(cont|profil)/u.test(normalized)) return "account";
  if (/(tehn|bug|eroare)/u.test(normalized)) return "technical";
  return "general";
}

function titleFromMessage(message: string) {
  const clean = message.replace(/\s+/gu, " ").trim();
  return clean.slice(0, 84) || "Solicitare de suport";
}

async function audit(actor: SupportIdentity | null, action: string, entityId: string, changes: Record<string, unknown> = {}) {
  await db().from("audit_events").insert({
    actor_profile_id: actor?.profileId ?? null,
    actor_role: actor?.role ?? "system",
    action,
    entity_type: "support_ticket",
    entity_id: entityId,
    changes,
  });
}

async function notifyClient(profileId: string | null, email: string | null, title: string, message: string, ticketId: string) {
  if (profileId) {
    await db().from("notifications").insert({
      profile_id: profileId,
      title,
      message,
      type: "system",
      action_url: "/client/support",
      metadata: { ticketId },
    });
  }
  await sendSupportEmail({ to: email, title, message, ticketId });
}

export async function purgeExpiredSupportConversations() {
  await db().from("assistant_conversations").delete().lt("expires_at", new Date().toISOString());
}

export async function listConversations(identity: SupportIdentity) {
  await purgeExpiredSupportConversations();
  const { data, error } = await db().from("assistant_conversations")
    .select("id,title,mode,last_message_at,created_at,support_tickets(id,status,assigned_operator_profile_id,priority)")
    .eq("profile_id", identity.profileId).gt("expires_at", new Date().toISOString())
    .order("last_message_at", { ascending: false }).limit(30);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getConversation(identity: SupportIdentity, conversationId: string) {
  const query = db().from("assistant_conversations")
    .select("id,profile_id,contact_email,contact_name,title,mode,last_message_at,expires_at,created_at,support_tickets(id,source,subject,category,priority,status,assigned_operator_profile_id,ai_summary,linked_order_id,profiles:assigned_operator_profile_id(full_name,email)),assistant_messages(id,author_type,author_profile_id,body,created_at)")
    .eq("id", conversationId).gt("expires_at", new Date().toISOString());
  if (!isAuthorizedSupportOperator(identity)) query.eq("profile_id", identity.profileId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createConversation(identity: SupportIdentity) {
  await purgeExpiredSupportConversations();
  const { data, error } = await db().from("assistant_conversations").insert({
    profile_id: identity.profileId, contact_email: null, contact_name: null,
  }).select("id,title,mode,last_message_at,created_at").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function persistAiExchange(identity: SupportIdentity, message: string, reply: string, conversationId?: string | null) {
  const conversation = conversationId ? await getConversation(identity, conversationId) : await createConversation(identity);
  if (!conversation) throw new Error("conversation_not_found");
  if (conversation.mode !== "ai_active") throw new Error("human_support_active");
  const client = await db().from("assistant_messages").insert({
    conversation_id: conversation.id, author_type: "client", author_profile_id: identity.profileId, body: message,
  });
  if (client.error) throw new Error(client.error.message);
  const assistant = await db().from("assistant_messages").insert({
    conversation_id: conversation.id, author_type: "assistant", body: reply,
  });
  if (assistant.error) throw new Error(assistant.error.message);
  await db().from("assistant_conversations").update({
    title: titleFromMessage(message), last_message_at: new Date().toISOString(),
  }).eq("id", conversation.id);
  return conversation.id as string;
}

export async function handoffConversation(identity: SupportIdentity, conversationId: string) {
  const conversation = await getConversation(identity, conversationId);
  if (!conversation || conversation.profile_id !== identity.profileId) throw new Error("conversation_not_found");
  const currentTicket = Array.isArray(conversation.support_tickets) ? conversation.support_tickets[0] : conversation.support_tickets;
  if (currentTicket?.id) return currentTicket;
  const history = Array.isArray(conversation.assistant_messages) ? conversation.assistant_messages : [];
  const clientText = history.filter((item: any) => item.author_type === "client").map((item: any) => item.body).join("\n");
  const subject = titleFromMessage(clientText || conversation.title);
  const category = categoryFromContact(clientText);
  const { data: ticket, error } = await db().from("support_tickets").insert({
    conversation_id: conversationId, source: "ai_handoff", client_profile_id: identity.profileId,
    subject, category, priority: priorityForSupportText(clientText), status: "open",
    ai_summary: `Clientul solicită intervenție umană. Subiect: ${subject}.`,
  }).select("*").single();
  if (error) throw new Error(error.message);
  await db().from("assistant_conversations").update({ mode: "human_requested", last_message_at: new Date().toISOString() }).eq("id", conversationId);
  await db().from("assistant_messages").insert({ conversation_id: conversationId, author_type: "system", body: "Solicitarea a fost trimisă către un operator SkySend." });
  await audit(identity, "support_ticket_created_from_ai", ticket.id, { conversationId });
  await notifyClient(identity.profileId, identity.email, "Solicitarea ta a ajuns la suport", "Un operator SkySend va prelua conversația. Poți reveni aici pentru răspuns.", ticket.id);
  return ticket;
}

export const publicContactSchema = z.object({
  email: z.string().trim().email().max(254), subject: z.string().trim().min(1).max(200),
  category: z.string().trim().max(80).nullable().optional(), message: z.string().trim().min(1).max(5000),
});

export async function createPublicContactTicket(input: z.infer<typeof publicContactSchema>) {
  await purgeExpiredSupportConversations();
  const { data: conversation, error: conversationError } = await db().from("assistant_conversations").insert({
    contact_email: input.email, title: input.subject, mode: "human_requested",
  }).select("id").single();
  if (conversationError) throw new Error(conversationError.message);
  const { data: ticket, error: ticketError } = await db().from("support_tickets").insert({
    conversation_id: conversation.id, source: "contact_form", subject: input.subject,
    category: categoryFromContact(input.category), priority: priorityForSupportText(`${input.subject}\n${input.message}`), status: "open",
  }).select("id").single();
  if (ticketError) throw new Error(ticketError.message);
  await db().from("assistant_messages").insert({ conversation_id: conversation.id, author_type: "client", body: input.message });
  await audit(null, "support_ticket_created_from_contact", ticket.id, { conversationId: conversation.id });
  return { conversationId: conversation.id as string, ticketId: ticket.id as string };
}

export async function listTickets(identity: SupportIdentity, queue: string) {
  if (!isAuthorizedSupportOperator(identity)) throw new Error("forbidden");
  let query = db().from("support_tickets").select("id,conversation_id,source,subject,category,priority,status,assigned_operator_profile_id,client_profile_id,linked_order_id,created_at,updated_at,assistant_conversations(contact_email,contact_name,title),profiles:client_profile_id(full_name,email)").order("updated_at", { ascending: false }).limit(100);
  if (queue === "mine") query = query.eq("assigned_operator_profile_id", identity.profileId);
  else if (queue === "waiting_customer") query = query.eq("status", "waiting_customer");
  else if (queue === "resolved") query = query.in("status", ["resolved", "closed"]);
  else query = query.is("assigned_operator_profile_id", null).in("status", ["open", "assigned"]);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateTicket(identity: SupportIdentity, ticketId: string, input: { status?: SupportStatus; assignToMe?: boolean }) {
  if (!isAuthorizedSupportOperator(identity)) throw new Error("forbidden");
  const payload: Record<string, unknown> = {};
  if (input.assignToMe) { payload.assigned_operator_profile_id = identity.profileId; payload.status = "assigned"; }
  if (input.status) { payload.status = input.status; if (input.status === "resolved") payload.resolved_at = new Date().toISOString(); if (input.status === "closed") payload.closed_at = new Date().toISOString(); }
  const { data, error } = await db().from("support_tickets").update(payload).eq("id", ticketId).select("*, assistant_conversations(contact_email), profiles:client_profile_id(email)").single();
  if (error) throw new Error(error.message);
  await audit(identity, "support_ticket_updated", ticketId, payload);
  if (input.status) await notifyClient(data.client_profile_id, data.profiles?.email ?? data.assistant_conversations?.contact_email ?? null, "Actualizare solicitare SkySend", `Statusul solicitării tale este acum: ${input.status}.`, ticketId);
  return data;
}

export async function addSupportMessage(identity: SupportIdentity, conversationId: string, body: string) {
  const conversation = await getConversation(identity, conversationId);
  if (!conversation) throw new Error("conversation_not_found");
  const staff = isAuthorizedSupportOperator(identity);
  const ticket = Array.isArray(conversation.support_tickets) ? conversation.support_tickets[0] : conversation.support_tickets;
  if (!ticket) throw new Error("ticket_not_found");
  const authorType: SupportActor = staff ? "operator" : "client";
  const { error } = await db().from("assistant_messages").insert({ conversation_id: conversationId, author_type: authorType, author_profile_id: identity.profileId, body });
  if (error) throw new Error(error.message);
  const nextStatus: SupportStatus = staff ? "waiting_customer" : (ticket.assigned_operator_profile_id ? "assigned" : "open");
  await db().from("support_tickets").update({ status: nextStatus }).eq("id", ticket.id);
  await db().from("assistant_conversations").update({ mode: "human_active", last_message_at: new Date().toISOString() }).eq("id", conversationId);
  await audit(identity, staff ? "support_operator_message" : "support_client_message", ticket.id);
  if (staff) await notifyClient(ticket.client_profile_id, conversation.contact_email, "Ai un răspuns de la SkySend", "Un operator ți-a răspuns. Deschide SkySend pentru a continua conversația.", ticket.id);
  return { status: nextStatus };
}
