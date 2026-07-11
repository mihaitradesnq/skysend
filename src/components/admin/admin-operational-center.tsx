"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CheckCircle2,
  Clock3,
  Inbox,
  Loader2,
  MessageSquareText,
  Package2,
  RadioTower,
  RefreshCw,
  Send,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ParcelEstimateTracePanel } from "@/components/admin/parcel-estimate-trace-panel";
import { AppButton } from "@/components/shared/app-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { cancelRuntimeOrdersInProgress } from "@/lib/admin-data";
import {
  addOperatorParcelEvaluationQuestion,
  finalizeOperatorParcelEvaluation,
  operatorParcelEvaluationStatusLabels,
  operatorParcelWarningLabels,
  subscribeOperatorParcelEvaluations,
} from "@/lib/operator-parcel-evaluations";
import { cn } from "@/lib/utils";
import type { AdminAuditActor, OperationalPlatformStatus } from "@/types/admin";
import type {
  OperationalCenterData,
  OperationalContactMessage,
  OperationalEvent,
  OperationalIncident,
  OperationalMapOrder,
} from "@/types/admin-operational";
import type {
  OperatorParcelEvaluation,
  OperatorParcelWarning,
} from "@/types/operator-parcel-evaluation";

type OperationalCenterViewProps = {
  initialData: OperationalCenterData;
};

type StatusTone = "neutral" | "success" | "warning" | "destructive" | "info";
type BulkOrderActionFeedback = {
  tone: "success" | "destructive";
  message: string;
};
type OperatorEvaluationDraft = {
  question: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  warnings: OperatorParcelWarning[];
};

const operatorEvaluationWarningOptions: OperatorParcelWarning[] = [
  "fragile",
  "temperature",
  "liquid",
  "humidity",
  "orientation",
];

const adminBulkActor: AdminAuditActor = {
  actorId: "admin-local",
  actorRole: "admin",
  actorName: "Panou Administrator",
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Nesalvat";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value: OperationalMapOrder["price"]) {
  if (!value) {
    return "Preț indisponibil";
  }

  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: value.currency,
  }).format(value.amountMinor / 100);
}

function getOrderTone(order: OperationalMapOrder): StatusTone {
  if (order.status === "in_flight") {
    return "info";
  }

  if (order.status === "queued" || order.status === "scheduled") {
    return "warning";
  }

  return "neutral";
}

function getIncidentTone(incident: OperationalIncident): StatusTone {
  if (incident.priority === "urgent") {
    return "destructive";
  }

  if (incident.priority === "high") {
    return "warning";
  }

  return "neutral";
}

function getEventTone(tone: OperationalEvent["tone"]): StatusTone {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "destructive":
      return "destructive";
    case "info":
      return "info";
    case "neutral":
      return "neutral";
  }
}

function getPlatformTone(status: OperationalPlatformStatus): StatusTone {
  switch (status) {
    case "active":
      return "success";
    case "maintenance":
      return "warning";
  }
}

function EmptyQueueState({ children }: { children: string }) {
  return (
    <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4 text-sm leading-6 text-muted-foreground">
      {children}
    </div>
  );
}

function getOperatorEvaluationTone(
  evaluation: OperatorParcelEvaluation,
): StatusTone {
  if (evaluation.status === "finalized") {
    return "success";
  }

  if (evaluation.status === "waiting_customer") {
    return "warning";
  }

  if (evaluation.status === "closed") {
    return "neutral";
  }

  return "info";
}

function createOperatorEvaluationDraft(
  evaluation: OperatorParcelEvaluation | null,
): OperatorEvaluationDraft {
  return {
    question: "",
    weightKg: evaluation?.profile?.weightKg
      ? String(evaluation.profile.weightKg)
      : "",
    lengthCm: evaluation?.profile?.lengthCm
      ? String(evaluation.profile.lengthCm)
      : "",
    widthCm: evaluation?.profile?.widthCm ? String(evaluation.profile.widthCm) : "",
    heightCm: evaluation?.profile?.heightCm
      ? String(evaluation.profile.heightCm)
      : "",
    warnings: evaluation?.profile?.warnings ?? [],
  };
}

function parsePositiveNumber(value: string) {
  const parsedValue = Number(value.replace(",", "."));

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function OverviewCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  tone: StatusTone;
}) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.375rem)]">
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <StatusBadge
            label={tone === "destructive" ? "Urgent" : "Status"}
            tone={tone}
          />
        </div>
        <p className="font-heading text-3xl tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function QueueHeader({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: typeof Package2;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex gap-3">
        <div className="mt-0.5 rounded-full bg-secondary p-2 text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <AppButton asChild variant="outline" size="sm">
        <Link href={href}>
          Deschide
          <ArrowRight className="size-4" />
        </Link>
      </AppButton>
    </div>
  );
}

function ActiveOrdersQueue({ orders }: { orders: OperationalMapOrder[] }) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <QueueHeader
          icon={Package2}
          title="Comenzi active"
          description="Programate, în așteptare sau în zbor, ordonate după starea curentă."
          href="/admin/orders"
        />

        <div className="grid gap-2">
          {orders.slice(0, 8).map((order) => (
            <Link
              key={order.id}
              href={order.href}
              className="grid gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-card p-4 transition-colors hover:border-primary/45 hover:bg-secondary/30 lg:grid-cols-[8rem_minmax(0,1.1fr)_minmax(0,1.3fr)_7rem_8rem]"
            >
              <div>
                <p className="text-xs text-muted-foreground">Comanda</p>
                <p className="mt-1 font-medium text-foreground">{order.shortId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">
                  {order.customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ruta</p>
                <p className="mt-1 truncate text-sm text-foreground">
                  {order.pickup.label} către {order.dropoff.label}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {order.etaLabel}
                </p>
              </div>
              <div className="flex items-center gap-2 lg:justify-end">
                <StatusBadge label={order.statusLabel} tone={getOrderTone(order)} />
              </div>
            </Link>
          ))}

          {orders.length === 0 ? (
            <EmptyQueueState>Nu există comenzi active în datele disponibile.</EmptyQueueState>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function FailedOrdersQueue({ incidents }: { incidents: OperationalIncident[] }) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <QueueHeader
          icon={ShieldAlert}
          title="Incidente"
          description="Cazuri de rezolvat operațional, fără recuperări locker dublate."
          href="/admin/failed-orders"
        />

        <div className="grid gap-2">
          {incidents.slice(0, 8).map((incident) => (
            <Link
              key={incident.id}
              href={incident.href}
              className="grid gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-card p-4 transition-colors hover:border-primary/45 hover:bg-secondary/30 lg:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.2fr)_8rem]"
            >
              <div>
                <p className="text-xs text-muted-foreground">Comanda</p>
                <p className="mt-1 font-medium text-foreground">
                  {incident.shortOrderId}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Motiv</p>
                <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">
                  {incident.description}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Locație colet</p>
                <p className="mt-1 truncate text-sm text-foreground">
                  {incident.locationLabel}
                </p>
              </div>
              <div className="flex items-center gap-2 lg:justify-end">
                <StatusBadge
                  label={incident.priorityLabel}
                  tone={getIncidentTone(incident)}
                />
              </div>
            </Link>
          ))}

          {incidents.length === 0 ? (
            <EmptyQueueState>Nu există incidente în datele disponibile.</EmptyQueueState>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ContactMessagesQueue({
  messages,
}: {
  messages: OperationalContactMessage[];
}) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <QueueHeader
          icon={Inbox}
          title="Mesaje noi"
          description="Mesaje primite și nesortate încă în fluxul de suport."
          href="/admin/contact-messages"
        />

        <div className="grid gap-2">
          {messages.slice(0, 6).map((message) => (
            <Link
              key={message.id}
              href={message.href}
              className="grid gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-card p-4 transition-colors hover:border-primary/45 hover:bg-secondary/30 sm:grid-cols-[minmax(0,1fr)_8rem]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {message.subject}
                  </p>
                  <StatusBadge label={message.categoryLabel} tone="info" />
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {message.email} / {formatDateTime(message.createdAt)}
                </p>
              </div>
              <div className="flex items-center sm:justify-end">
                <StatusBadge label={message.statusLabel} tone="info" />
              </div>
            </Link>
          ))}

          {messages.length === 0 ? (
            <EmptyQueueState>Nu există mesaje noi.</EmptyQueueState>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function ParcelEvaluationsQueue({
  evaluations,
  selectedEvaluationId,
  draft,
  feedback,
  onSelectEvaluation,
  onDraftChange,
  onToggleWarning,
  onSendQuestion,
  onSaveProfile,
}: {
  evaluations: OperatorParcelEvaluation[];
  selectedEvaluationId: string | null;
  draft: OperatorEvaluationDraft;
  feedback: string | null;
  onSelectEvaluation: (evaluation: OperatorParcelEvaluation) => void;
  onDraftChange: <K extends keyof OperatorEvaluationDraft>(
    field: K,
    value: OperatorEvaluationDraft[K],
  ) => void;
  onToggleWarning: (warning: OperatorParcelWarning) => void;
  onSendQuestion: (evaluation: OperatorParcelEvaluation) => void;
  onSaveProfile: (evaluation: OperatorParcelEvaluation) => void;
}) {
  const selectedEvaluation =
    evaluations.find((evaluation) => evaluation.id === selectedEvaluationId) ??
    evaluations[0] ??
    null;
  const activeQuestion = selectedEvaluation?.questions.find(
    (question) => !question.answer,
  );
  const isClosed =
    selectedEvaluation?.status === "finalized" ||
    selectedEvaluation?.status === "closed";
  const canSendQuestion =
    Boolean(selectedEvaluation && draft.question.trim()) &&
    !activeQuestion &&
    !isClosed;
  const canSaveProfile =
    Boolean(selectedEvaluation) &&
    Boolean(parsePositiveNumber(draft.weightKg)) &&
    Boolean(parsePositiveNumber(draft.lengthCm)) &&
    Boolean(parsePositiveNumber(draft.widthCm)) &&
    Boolean(parsePositiveNumber(draft.heightCm)) &&
    !isClosed;

  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="mt-0.5 rounded-full bg-secondary p-2 text-muted-foreground">
              <MessageSquareText className="size-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">Evaluari colet</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Coada secundara pentru profiluri de colet cerute de clienti.
              </p>
            </div>
          </div>
          <StatusBadge
            label={`${evaluations.filter((evaluation) => evaluation.status !== "finalized" && evaluation.status !== "closed").length} active`}
            tone={evaluations.length ? "info" : "neutral"}
          />
        </div>

        <div className="grid gap-2">
          {evaluations.slice(0, 6).map((evaluation) => (
            <button
              key={evaluation.id}
              type="button"
              onClick={() => onSelectEvaluation(evaluation)}
              className={cn(
                "grid gap-2 rounded-[calc(var(--radius)+0.35rem)] border p-3 text-left transition-colors hover:border-primary/45 hover:bg-secondary/30 md:grid-cols-[minmax(0,1fr)_7rem_8rem]",
                selectedEvaluation?.id === evaluation.id
                  ? "border-primary/45 bg-primary/8"
                  : "border-border/75 bg-card",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {evaluation.sessionId}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {evaluation.initialDescription}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Intrebari</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {evaluation.questions.length}
                </p>
              </div>
              <div className="flex items-center md:justify-end">
                <StatusBadge
                  label={operatorParcelEvaluationStatusLabels[evaluation.status]}
                  tone={getOperatorEvaluationTone(evaluation)}
                />
              </div>
            </button>
          ))}

          {evaluations.length === 0 ? (
            <EmptyQueueState>Nu exista evaluari de colet in lucru.</EmptyQueueState>
          ) : null}
        </div>

        {selectedEvaluation ? (
          <div className="grid gap-4 rounded-[calc(var(--radius)+0.45rem)] border border-border/75 bg-secondary/20 p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Descriere initiala AI
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {selectedEvaluation.initialDescription}
                </p>
              </div>
              <div className="grid gap-2 text-sm">
                <StatusBadge
                  label={operatorParcelEvaluationStatusLabels[selectedEvaluation.status]}
                  tone={getOperatorEvaluationTone(selectedEvaluation)}
                  className="w-fit"
                />
                <span className="text-muted-foreground">
                  {selectedEvaluation.questions.length} intrebari trimise
                </span>
              </div>
            </div>

            {selectedEvaluation.estimateTrace ? (
              <ParcelEstimateTracePanel
                estimateTrace={selectedEvaluation.estimateTrace}
              />
            ) : null}

            <div className="grid gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Istoric intrebari si raspunsuri
              </p>
              {selectedEvaluation.questions.length ? (
                selectedEvaluation.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="grid gap-2 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-card p-3 text-sm"
                  >
                    <p className="font-medium text-foreground">
                      {index + 1}. {question.question}
                    </p>
                    <p className="leading-6 text-muted-foreground">
                      {question.answer ?? "Fara raspuns inca."}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyQueueState>Nu au fost trimise intrebari.</EmptyQueueState>
              )}
            </div>

            <div className="grid gap-3">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Intrebare pentru client
                </span>
                <textarea
                  value={draft.question}
                  rows={3}
                  placeholder="Ex: Coletul contine lichide sau recipiente fragile?"
                  onChange={(event) => onDraftChange("question", event.target.value)}
                  className="min-h-24 w-full resize-y rounded-[var(--ui-radius-card)] border border-input bg-card px-4 py-3 text-sm leading-6 outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-primary/15 focus-visible:ring-4 focus-visible:ring-ring"
                />
              </label>
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-fit"
                onClick={() => onSendQuestion(selectedEvaluation)}
                disabled={!canSendQuestion}
              >
                <Send className="size-4" />
                Trimite intrebare
              </AppButton>
            </div>

            <div className="grid gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Profil colet completat de admin
              </p>
              <div className="grid gap-3 sm:grid-cols-4">
                {[
                  ["weightKg", "Greutate kg"],
                  ["lengthCm", "Lungime cm"],
                  ["widthCm", "Latime cm"],
                  ["heightCm", "Inaltime cm"],
                ].map(([field, label]) => (
                  <label key={field} className="grid gap-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <input
                      type="number"
                      min="0.1"
                      step={field === "weightKg" ? "0.1" : "1"}
                      value={draft[field as keyof OperatorEvaluationDraft] as string}
                      onChange={(event) =>
                        onDraftChange(
                          field as keyof OperatorEvaluationDraft,
                          event.target.value as never,
                        )
                      }
                      className="h-11 rounded-2xl border border-input bg-card px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-primary/15 focus-visible:ring-4 focus-visible:ring-ring"
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {operatorEvaluationWarningOptions.map((warning) => (
                  <label
                    key={warning}
                    className="flex min-h-10 items-center gap-2 rounded-2xl border border-border/80 bg-card px-3 text-sm text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={draft.warnings.includes(warning)}
                      onChange={() => onToggleWarning(warning)}
                      className="size-4 accent-primary"
                    />
                    {operatorParcelWarningLabels[warning]}
                  </label>
                ))}
              </div>

              <AppButton
                type="button"
                size="sm"
                className="w-full sm:w-fit"
                onClick={() => onSaveProfile(selectedEvaluation)}
                disabled={!canSaveProfile}
              >
                <CheckCircle2 className="size-4" />
                Salveaza profilul
              </AppButton>
            </div>

            {feedback ? (
              <div className="rounded-[calc(var(--radius)+0.35rem)] border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-6 text-muted-foreground">
                {feedback}
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function PlatformStatusPanel({ data }: { data: OperationalCenterData }) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <QueueHeader
          icon={Settings}
          title="Status platformă"
          description="Setări operaționale folosite de panoul admin."
          href="/admin/settings"
        />

        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4">
            <span className="text-muted-foreground">Platforma</span>
            <StatusBadge
              label={data.platform.statusLabel}
              tone={getPlatformTone(data.platform.status)}
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4">
            <span className="text-muted-foreground">Rază activă</span>
            <span className="font-medium text-foreground">
              {data.platform.serviceRadiusKm} km
            </span>
          </div>
          <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4">
            <p className="text-muted-foreground">Hub</p>
            <p className="mt-2 text-sm font-medium leading-6 text-foreground">
              {data.platform.hubAddressLabel}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4">
            <span className="text-muted-foreground">Ultima salvare</span>
            <span className="text-right font-medium text-foreground">
              {formatDateTime(data.platform.updatedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LockerRecoveryNotice({
  incidents,
}: {
  incidents: OperationalIncident[];
}) {
  if (incidents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-warning/35 bg-warning/8 px-4 py-3 text-sm">
      <div className="flex items-center gap-3">
        <AlertTriangle className="size-4 text-warning" />
        <p className="text-muted-foreground">
          {incidents.length} recuperări locker active generate de simulare.
        </p>
      </div>
      <AppButton asChild variant="outline" size="sm">
        <Link href="/admin/locker-recoveries">
          Vezi recuperări
          <ArrowRight className="size-4" />
        </Link>
      </AppButton>
    </div>
  );
}

function ActivityFeed({ events }: { events: OperationalEvent[] }) {
  return (
    <Card className="rounded-[calc(var(--radius)+0.5rem)]">
      <CardContent className="grid gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium text-foreground">Activitate recentă</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Evenimente calculate din comenzile și cazurile existente.
            </p>
          </div>
          <Clock3 className="size-5 text-muted-foreground" />
        </div>

        <div className="grid gap-2">
          {events.slice(0, 6).map((event) => (
            <div
              key={event.id}
              className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge
                  label={event.tone === "destructive" ? "Urgent" : "Eveniment"}
                  tone={getEventTone(event.tone)}
                />
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(event.occurredAt)}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {event.title}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {event.description}
              </p>
            </div>
          ))}

          {events.length === 0 ? (
            <EmptyQueueState>Nu există activitate recentă de afișat.</EmptyQueueState>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminOperationalCenterView({
  initialData,
}: OperationalCenterViewProps) {
  const [data, setData] = useState(initialData);
  const [bulkActionFeedback, setBulkActionFeedback] =
    useState<BulkOrderActionFeedback | null>(null);
  const [bulkActionRunning, setBulkActionRunning] = useState<"cancel" | null>(
    null,
  );
  const [isManualRefreshRunning, setIsManualRefreshRunning] = useState(false);
  const [selectedParcelEvaluationId, setSelectedParcelEvaluationId] = useState<
    string | null
  >(initialData.parcelEvaluations[0]?.id ?? null);
  const selectedParcelEvaluation =
    data.parcelEvaluations.find(
      (evaluation) => evaluation.id === selectedParcelEvaluationId,
    ) ??
    data.parcelEvaluations[0] ??
    null;
  const [parcelEvaluationDraft, setParcelEvaluationDraft] =
    useState<OperatorEvaluationDraft>(() =>
      createOperatorEvaluationDraft(selectedParcelEvaluation),
    );
  const [parcelEvaluationFeedback, setParcelEvaluationFeedback] = useState<
    string | null
  >(null);

  const refreshOperationalData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/operational-center", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        return;
      }

      const refreshed = (await response.json()) as OperationalCenterData;

      refreshed.parcelEvaluations = data.parcelEvaluations;
      setData(refreshed);
    } catch {
      // Keep the SSR-loaded data on network/parse failure.
    }
  }, [data.parcelEvaluations]);

  useEffect(() => {
    void Promise.resolve().then(refreshOperationalData);
  }, [refreshOperationalData]);

  useEffect(() => {
    return subscribeOperatorParcelEvaluations(refreshOperationalData);
  }, [refreshOperationalData]);

  useEffect(() => {
    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        void refreshOperationalData();
      }
    }

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshOperationalData]);

  const failedIncidents = useMemo(
    () => data.incidents.filter((incident) => incident.kind === "failed_order"),
    [data.incidents],
  );
  const lockerIncidents = useMemo(
    () => data.incidents.filter((incident) => incident.kind === "locker_recovery"),
    [data.incidents],
  );
  const urgentFailedCount = failedIncidents.filter(
    (incident) => incident.priority === "urgent" || incident.priority === "high",
  ).length;

  function handleSelectParcelEvaluation(evaluation: OperatorParcelEvaluation) {
    setSelectedParcelEvaluationId(evaluation.id);
    setParcelEvaluationDraft(createOperatorEvaluationDraft(evaluation));
    setParcelEvaluationFeedback(null);
  }

  function handleParcelEvaluationDraftChange<K extends keyof OperatorEvaluationDraft>(
    field: K,
    value: OperatorEvaluationDraft[K],
  ) {
    setParcelEvaluationDraft((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
    setParcelEvaluationFeedback(null);
  }

  function handleToggleParcelWarning(warning: OperatorParcelWarning) {
    setParcelEvaluationDraft((currentValue) => ({
      ...currentValue,
      warnings: currentValue.warnings.includes(warning)
        ? currentValue.warnings.filter((item) => item !== warning)
        : [...currentValue.warnings, warning],
    }));
    setParcelEvaluationFeedback(null);
  }

  function handleSendParcelQuestion(evaluation: OperatorParcelEvaluation) {
    const result = addOperatorParcelEvaluationQuestion({
      evaluationId: evaluation.id,
      question: parcelEvaluationDraft.question,
    });

    if (!result.ok) {
      setParcelEvaluationFeedback(
        result.reason === "active_question_exists"
          ? "Exista deja o intrebare fara raspuns."
          : "Intrebarea nu poate fi trimisa pentru aceasta evaluare.",
      );
      return;
    }

    refreshOperationalData();
    setSelectedParcelEvaluationId(result.evaluation.id);
    setParcelEvaluationDraft((currentValue) => ({
      ...currentValue,
      question: "",
    }));
    setParcelEvaluationFeedback("Intrebarea a fost trimisa clientului.");
  }

  function handleSaveParcelProfile(evaluation: OperatorParcelEvaluation) {
    const weightKg = parsePositiveNumber(parcelEvaluationDraft.weightKg);
    const lengthCm = parsePositiveNumber(parcelEvaluationDraft.lengthCm);
    const widthCm = parsePositiveNumber(parcelEvaluationDraft.widthCm);
    const heightCm = parsePositiveNumber(parcelEvaluationDraft.heightCm);

    if (!weightKg || !lengthCm || !widthCm || !heightCm) {
      setParcelEvaluationFeedback(
        "Completeaza greutatea si toate dimensiunile cu valori pozitive.",
      );
      return;
    }

    const result = finalizeOperatorParcelEvaluation({
      evaluationId: evaluation.id,
      profile: {
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
        warnings: parcelEvaluationDraft.warnings,
      },
    });

    if (!result.ok) {
      setParcelEvaluationFeedback(
        "Profilul nu poate fi salvat pentru aceasta evaluare.",
      );
      return;
    }

    refreshOperationalData();
    setSelectedParcelEvaluationId(result.evaluation.id);
    setParcelEvaluationDraft(createOperatorEvaluationDraft(result.evaluation));
    setParcelEvaluationFeedback(
      "Profilul a fost salvat. Thread-ul clientului se inchide automat.",
    );
  }

  function handleCancelActiveOrders() {
    if (data.activeOrders.length === 0) {
      setBulkActionFeedback({
        tone: "success",
        message: "Nu există comenzi în desfășurare de anulat.",
      });
      return;
    }

    const confirmed = window.confirm(
      `Anulezi ${data.activeOrders.length} comenzi în desfășurare? Comenzile vor rămâne în istoric, dar nu vor mai apărea ca livrări active.`,
    );

    if (!confirmed) {
      return;
    }

    setBulkActionRunning("cancel");
    const result = cancelRuntimeOrdersInProgress({
      actor: adminBulkActor,
      reason: "Anulare în masă din Privire generală.",
    });

    if (!result.ok) {
      setBulkActionFeedback({
        tone: "destructive",
        message: "Comenzile nu pot fi anulate în acest browser deoarece stocarea locală nu este disponibilă.",
      });
      setBulkActionRunning(null);
      return;
    }

    refreshOperationalData();
    setBulkActionFeedback({
      tone: "success",
      message:
        result.affectedOrders === 1
          ? "O comandă în desfășurare a fost anulată."
          : `${result.affectedOrders} comenzi în desfășurare au fost anulate.`,
    });
    setBulkActionRunning(null);
  }

  async function handleManualRefresh() {
    setIsManualRefreshRunning(true);
    await refreshOperationalData();
    setIsManualRefreshRunning(false);
  }

  return (
    <section className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow="Panou Administrator"
        title="Privire generală"
        description="Cozi de lucru pentru comenzi, incidente, mesaje și statusul platformei."
        actions={
          <>
            <AppButton
              type="button"
              variant="outline"
              onClick={() => void handleManualRefresh()}
              disabled={isManualRefreshRunning}
            >
              {isManualRefreshRunning ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Refresh
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              onClick={handleCancelActiveOrders}
              disabled={Boolean(bulkActionRunning) || data.activeOrders.length === 0}
            >
              {bulkActionRunning === "cancel" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Ban className="size-4" />
              )}
              Anulează active
            </AppButton>
            <AppButton asChild variant="outline">
              <Link href="/admin/orders">
                Comenzi
                <ArrowRight className="size-4" />
              </Link>
            </AppButton>
            <AppButton asChild variant="outline">
              <Link href="/admin/contact-messages">
                Mesaje
                <Inbox className="size-4" />
              </Link>
            </AppButton>
          </>
        }
      />

      {bulkActionFeedback ? (
        <div
          className={cn(
            "rounded-[calc(var(--radius)+0.35rem)] border px-4 py-3 text-sm leading-6",
            bulkActionFeedback.tone === "destructive"
              ? "border-destructive/40 bg-destructive/8 text-destructive"
              : "border-primary/35 bg-primary/10 text-foreground",
          )}
        >
          {bulkActionFeedback.message}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <OverviewCard
          label="Comenzi active"
          value={`${data.activeOrders.length}`}
          hint="Programate, în așteptare sau în zbor."
          tone={data.activeOrders.length > 0 ? "info" : "neutral"}
        />
        <OverviewCard
          label="Incidente"
          value={`${failedIncidents.length}`}
          hint={
            urgentFailedCount > 0
              ? `${urgentFailedCount} cazuri cu prioritate ridicată.`
              : "Fără cazuri prioritare în listă."
          }
          tone={urgentFailedCount > 0 ? "warning" : "neutral"}
        />
        <OverviewCard
          label="Evaluari colet"
          value={`${data.parcelEvaluations.length}`}
          hint="Cereri de profil colet in lucru sau finalizate."
          tone={data.parcelEvaluations.length > 0 ? "info" : "neutral"}
        />
        <OverviewCard
          label="Mesaje noi"
          value={`${data.contactMessages.length}`}
          hint="Mesaje care nu au fost preluate încă."
          tone={data.contactMessages.length > 0 ? "info" : "neutral"}
        />
        <OverviewCard
          label="Status platformă"
          value={data.platform.statusLabel}
          hint={`Rază activă: ${data.platform.serviceRadiusKm} km.`}
          tone={getPlatformTone(data.platform.status)}
        />
      </div>

      <LockerRecoveryNotice incidents={lockerIncidents} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
        <div className="grid gap-5">
          <ActiveOrdersQueue orders={data.activeOrders} />
          <ParcelEvaluationsQueue
            evaluations={data.parcelEvaluations}
            selectedEvaluationId={selectedParcelEvaluationId}
            draft={parcelEvaluationDraft}
            feedback={parcelEvaluationFeedback}
            onSelectEvaluation={handleSelectParcelEvaluation}
            onDraftChange={handleParcelEvaluationDraftChange}
            onToggleWarning={handleToggleParcelWarning}
            onSendQuestion={handleSendParcelQuestion}
            onSaveProfile={handleSaveParcelProfile}
          />
          <FailedOrdersQueue incidents={failedIncidents} />
        </div>

        <div className="grid content-start gap-5">
          <PlatformStatusPanel data={data} />
          <ContactMessagesQueue messages={data.contactMessages} />
          <ActivityFeed events={data.events} />
        </div>
      </div>

      <Card className="rounded-[calc(var(--radius)+0.5rem)]">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <RadioTower className="size-5 text-primary" />
            <span>
              Actualizat: {formatDateTime(data.generatedAt)} /{" "}
              {data.droneMarkers.length} drone in zbor /{" "}
              {data.activeOrders.filter((order) => order.hasCompleteRoute).length} trasee complete.
            </span>
          </div>
          <span className="font-medium text-foreground">
            Venit activ estimat:{" "}
            {formatMoney({
              amountMinor: data.activeOrders.reduce(
                (total, order) => total + (order.price?.amountMinor ?? 0),
                0,
              ),
              currency: "RON",
            })}
          </span>
        </CardContent>
      </Card>
    </section>
  );
}
