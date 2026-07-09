"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Inbox,
  MailOpen,
  MessageSquareText,
  PencilLine,
  Search,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AppButton } from "@/components/shared/app-button";
import { FilterBar } from "@/components/shared/filter-bar";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  contactMessageCategoryOptions,
  inboxContactMessageStatusOptions,
} from "@/lib/admin-contact-messages";
import { cn } from "@/lib/utils";
import type {
  AdminContactMessageDetail,
  AdminContactMessageUpdatePatch,
  ContactMessageCategory,
  InboxContactMessageStatus,
} from "@/types/admin-contact";
import type { FilterBarItem } from "@/types/ui";

type AdminContactMessagesViewProps = {
  initialMessages: AdminContactMessageDetail[];
};

type StatusFilter = "all" | InboxContactMessageStatus;
type CategoryFilter = "all" | ContactMessageCategory | "unknown";
type StatusTone = "neutral" | "success" | "warning" | "destructive" | "info";

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Indisponibil";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("ro-RO");
}

function getStatusTone(status: InboxContactMessageStatus): StatusTone {
  switch (status) {
    case "new":
      return "info";
    case "read":
      return "neutral";
    case "archived":
      return "neutral";
  }
}

function EmptyContactMessagesState() {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-6 text-center">
        <div className="mx-auto rounded-full bg-primary/10 p-3 text-primary">
          <Inbox className="size-6" />
        </div>
        <div>
          <p className="font-medium text-foreground">Nu există mesaje</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Mesajele trimise din pagina Contact vor apărea aici după salvare.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactMessagesList({
  messages,
  selectedMessageId,
  onSelect,
}: {
  messages: AdminContactMessageDetail[];
  selectedMessageId: string | null;
  onSelect: (messageId: string) => void;
}) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium text-foreground">Inbox</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {messages.length} mesaje după filtre.
            </p>
          </div>
          <MessageSquareText className="size-5 text-muted-foreground" />
        </div>

        <div className="hidden overflow-x-auto rounded-[calc(var(--radius)+0.35rem)] border border-border/75 xl:block">
          <table className="w-full min-w-[64rem]">
            <thead className="bg-secondary/45 text-left">
              <tr className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-4">Expeditor</th>
                <th className="px-4 py-4">Subiect</th>
                <th className="px-4 py-4">Categorie</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Primit la</th>
                <th className="px-4 py-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => {
                const isSelected = selectedMessageId === message.id;

                return (
                  <tr
                    key={message.id}
                    className={cn(
                      "border-t border-border/75 bg-card",
                      isSelected && "bg-primary/6",
                      message.status === "new" && "bg-primary/4",
                    )}
                  >
                    <td className="px-4 py-4 align-top text-sm">
                      <p className="font-medium text-foreground">{message.email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {message.persistenceLabel}
                      </p>
                    </td>
                    <td className="max-w-[24rem] px-4 py-4 align-top">
                      <p className="truncate text-sm font-medium text-foreground">
                        {message.subject}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {message.message}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge label={message.categoryLabel} tone="info" />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge
                        label={message.statusLabel}
                        tone={getStatusTone(message.status)}
                      />
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-muted-foreground">
                      {formatDateTime(message.createdAt)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end">
                        <AppButton
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => onSelect(message.id)}
                        >
                          <Search className="size-4" />
                          Detalii
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 xl:hidden">
          {messages.map((message) => {
            const isSelected = selectedMessageId === message.id;

            return (
              <Card
                key={message.id}
                className={cn(
                  "rounded-[calc(var(--radius)+0.375rem)]",
                  isSelected && "border-primary/50",
                  message.status === "new" && "border-primary/35",
                )}
              >
                <CardContent className="grid gap-4 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {message.subject}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {message.email}
                      </p>
                    </div>
                    <StatusBadge
                      label={message.statusLabel}
                      tone={getStatusTone(message.status)}
                    />
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {message.message}
                  </p>
                  <StatusBadge label={message.categoryLabel} tone="info" />
                  <AppButton
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelect(message.id)}
                  >
                    <Search className="size-4" />
                    Vezi detalii
                  </AppButton>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {messages.length === 0 ? <EmptyContactMessagesState /> : null}
      </CardContent>
    </Card>
  );
}

function ContactMessageDetailsPanel({
  message,
  onUpdate,
  isSaving,
}: {
  message: AdminContactMessageDetail | null;
  onUpdate: (
    messageId: string,
    patch: AdminContactMessageUpdatePatch,
  ) => void;
  isSaving: boolean;
}) {
  if (!message) {
    return (
      <Card className="rounded-[calc(var(--radius)+0.5rem)]">
        <CardContent className="p-5 text-sm leading-6 text-muted-foreground">
          Selectează un mesaj pentru detalii și notă internă.
        </CardContent>
      </Card>
    );
  }

  return (
    <ContactMessageDetailsPanelContent
      key={`${message.id}:${message.updatedAt}`}
      message={message}
      onUpdate={onUpdate}
      isSaving={isSaving}
    />
  );
}

function ContactMessageDetailsPanelContent({
  message,
  onUpdate,
  isSaving,
}: {
  message: AdminContactMessageDetail;
  onUpdate: (
    messageId: string,
    patch: AdminContactMessageUpdatePatch,
  ) => void;
  isSaving: boolean;
}) {
  const [internalNote, setInternalNote] = useState(message.internalNote ?? "");

  function updateStatus(status: InboxContactMessageStatus) {
    onUpdate(message.id, { status });
  }

  function saveInternalNote() {
    onUpdate(message.id, { internalNote: internalNote.trim() || null });
  }

  return (
    <div className="grid gap-5">
      <Card className="rounded-[calc(var(--radius)+0.5rem)]">
        <CardContent className="grid gap-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-heading text-xl tracking-tight text-foreground">
                {message.subject}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {message.email} / {formatDateTime(message.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                label={message.statusLabel}
                tone={getStatusTone(message.status)}
              />
              <StatusBadge label={message.categoryLabel} tone="info" />
            </div>
          </div>

          <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/35 p-4">
            <p className="text-xs text-muted-foreground">Mesaj</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground">
              {message.message}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-background p-4">
              <p className="text-xs text-muted-foreground">Sursa</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {message.sourceLabel}
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-background p-4">
              <p className="text-xs text-muted-foreground">Persistență</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {message.persistenceLabel}
              </p>
            </div>
            <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-background p-4">
              <p className="text-xs text-muted-foreground">Citit la</p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {formatDateTime(message.readAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[calc(var(--radius)+0.5rem)]">
        <CardContent className="grid gap-5 p-5">
          <div>
            <p className="font-medium text-foreground">Status mesaj</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Status intern pentru trierea mesajului în inbox.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {inboxContactMessageStatusOptions.map(([status, label]) => (
              <AppButton
                key={status}
                type="button"
                variant={message.status === status ? "default" : "outline"}
                onClick={() => updateStatus(status)}
                disabled={isSaving || message.status === status}
              >
                {status === "read" ? (
                  <MailOpen className="size-4" />
                ) : status === "archived" ? (
                  <Archive className="size-4" />
                ) : (
                  <Inbox className="size-4" />
                )}
                {label}
              </AppButton>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[calc(var(--radius)+0.5rem)]">
        <CardContent className="grid gap-5 p-5">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Notă internă
            </span>
            <textarea
              value={internalNote}
              onChange={(event) => setInternalNote(event.target.value)}
              rows={5}
              className="min-h-32 w-full rounded-2xl border border-input bg-muted px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] focus-visible:border-primary/55 focus-visible:ring-4 focus-visible:ring-ring"
              placeholder="Context intern pentru echipa SkySend."
            />
          </label>
          <AppButton
            type="button"
            variant="outline"
            onClick={saveInternalNote}
            disabled={isSaving}
            className="w-fit"
          >
            <PencilLine className="size-4" />
            Salvează nota internă
          </AppButton>
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminContactMessagesView({
  initialMessages,
}: AdminContactMessagesViewProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    initialMessages[0]?.id ?? null,
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refreshMessagesFromDB = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/contact-messages", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const body = (await response.json()) as {
        messages?: AdminContactMessageDetail[];
      };
      const refreshed = Array.isArray(body.messages) ? body.messages : [];

      setMessages(refreshed);
      setSelectedMessageId((currentId) => {
        const params = new URLSearchParams(window.location.search);
        const requestedMessageId = params.get("messageId");
        return (
          requestedMessageId ??
          currentId ??
          refreshed[0]?.id ??
          null
        );
      });
    } catch {
      // Keep SSR-loaded messages on network/parse failure rather than
      // silently wiping them.
    }
  }, []);

  useEffect(() => {
    void refreshMessagesFromDB();
  }, [refreshMessagesFromDB]);

  const filteredMessages = useMemo(() => {
    const query = normalizeSearch(search);

    return messages.filter((message) => {
      const matchesSearch =
        query.length === 0 ||
        normalizeSearch(message.email).includes(query) ||
        normalizeSearch(message.subject).includes(query) ||
        normalizeSearch(message.categoryLabel).includes(query) ||
        normalizeSearch(message.message).includes(query) ||
        normalizeSearch(message.internalNote ?? "").includes(query);

      return (
        matchesSearch &&
        (status === "all" || message.status === status) &&
        (category === "all" || message.categoryKey === category)
      );
    });
  }, [category, messages, search, status]);

  const selectedMessage =
    filteredMessages.find((message) => message.id === selectedMessageId) ??
    filteredMessages[0] ??
    null;
  const newCount = messages.filter((message) => message.status === "new").length;
  const readCount = messages.filter((message) => message.status === "read").length;
  const archivedCount = messages.filter(
    (message) => message.status === "archived",
  ).length;

  const filters: FilterBarItem[] = [
    {
      id: "status",
      label: "Status",
      value: status,
      onChange: (value) => setStatus(value as StatusFilter),
      options: [
        { label: "Toate statusurile", value: "all" },
        ...inboxContactMessageStatusOptions.map(([value, label]) => ({
          label,
          value,
        })),
      ],
    },
    {
      id: "category",
      label: "Categorie",
      value: category,
      onChange: (value) => setCategory(value as CategoryFilter),
      options: [
        { label: "Toate categoriile", value: "all" },
        ...contactMessageCategoryOptions.map(([value, label]) => ({
          label,
          value,
        })),
        { label: "Categorie necunoscută", value: "unknown" },
      ],
    },
  ];

  function refreshMessages(messageId: string | null) {
    setSelectedMessageId(messageId);
    void refreshMessagesFromDB();
  }

  async function handleUpdate(
    messageId: string,
    patch: AdminContactMessageUpdatePatch,
  ) {
    setIsSaving(true);

    const dbPatch: { status?: string; internalNote?: string | null } = {};
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.internalNote !== undefined) dbPatch.internalNote = patch.internalNote;

    if (Object.keys(dbPatch).length === 0) {
      setFeedback({
        tone: "success",
        message: "Nu au existat modificări noi de salvat.",
      });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/contact-messages/${encodeURIComponent(messageId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dbPatch),
        },
      );

      if (!response.ok) {
        const body: { error?: string } | null = await response
          .json()
          .catch(() => null);
        setFeedback({
          tone: "error",
          message:
            body?.error ??
            "Mesajul nu a putut fi salvat în baza de date.",
        });
        setIsSaving(false);
        return;
      }

      const body = (await response.json()) as {
        message?: AdminContactMessageDetail;
      };

      if (body.message) {
        await refreshMessagesFromDB();
      } else {
        await refreshMessagesFromDB();
      }

      setFeedback({
        tone: "success",
        message: "Modificările mesajului au fost salvate în baza de date.",
      });
      router.refresh();
    } catch (err) {
      console.error("[admin-contact-messages-view] update failed:", err);
      setFeedback({
        tone: "error",
        message: "Eroare de rețea la salvarea mesajului.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow="Panou Administrator"
        title="Mesaje"
        description="Mesaje primite din formularul public, cu status intern și notă opțională."
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="rounded-[calc(var(--radius)+0.375rem)]">
          <CardContent className="grid gap-2 p-4">
            <p className="text-sm text-muted-foreground">Mesaje totale</p>
            <p className="font-heading text-3xl tracking-tight">{messages.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[calc(var(--radius)+0.375rem)]">
          <CardContent className="grid gap-2 p-4">
            <p className="text-sm text-muted-foreground">Noi</p>
            <p className="font-heading text-3xl tracking-tight">{newCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[calc(var(--radius)+0.375rem)]">
          <CardContent className="grid gap-2 p-4">
            <p className="text-sm text-muted-foreground">Citite</p>
            <p className="font-heading text-3xl tracking-tight">{readCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[calc(var(--radius)+0.375rem)]">
          <CardContent className="grid gap-2 p-4">
            <p className="text-sm text-muted-foreground">Arhivate</p>
            <p className="font-heading text-3xl tracking-tight">{archivedCount}</p>
          </CardContent>
        </Card>
      </div>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Caută după e-mail, subiect, categorie, mesaj sau notă"
        filters={filters}
      />

      {feedback ? (
        <div
          className={cn(
            "rounded-[calc(var(--radius)+0.35rem)] border p-4 text-sm",
            feedback.tone === "success"
              ? "border-success/35 bg-success/10 text-foreground"
              : "border-destructive/35 bg-destructive/10 text-destructive",
          )}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
        <ContactMessagesList
          messages={filteredMessages}
          selectedMessageId={selectedMessage?.id ?? null}
          onSelect={setSelectedMessageId}
        />

        <ContactMessageDetailsPanel
          message={selectedMessage}
          onUpdate={handleUpdate}
          isSaving={isSaving}
        />
      </div>
    </section>
  );
}
