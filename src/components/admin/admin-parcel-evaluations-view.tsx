"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  MessageSquareText,
  PackageSearch,
  RefreshCw,
  Send,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ParcelEstimateTracePanel } from "@/components/admin/parcel-estimate-trace-panel";
import { AppButton } from "@/components/shared/app-button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  addOperatorParcelEvaluationQuestion,
  finalizeOperatorParcelEvaluation,
  markOperatorParcelEvaluationInReview,
  operatorParcelEvaluationStatusLabels,
  operatorParcelWarningLabels,
  readOperatorParcelEvaluations,
  subscribeOperatorParcelEvaluations,
} from "@/lib/operator-parcel-evaluations";
import { cn } from "@/lib/utils";
import type {
  OperatorParcelEvaluation,
  OperatorParcelWarning,
} from "@/types/operator-parcel-evaluation";

type OperatorEvaluationDraft = {
  question: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  warnings: OperatorParcelWarning[];
};

type StatusTone = "neutral" | "success" | "warning" | "destructive" | "info";

const warningOptions: OperatorParcelWarning[] = [
  "fragile",
  "temperature",
  "liquid",
  "humidity",
  "orientation",
];

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Nesalvat";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getEvaluationTone(evaluation: OperatorParcelEvaluation): StatusTone {
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

function parsePositiveNumber(value: string) {
  const parsedValue = Number(value.replace(",", "."));

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function createDraft(evaluation: OperatorParcelEvaluation | null): OperatorEvaluationDraft {
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

export function AdminParcelEvaluationsView() {
  const [evaluations, setEvaluations] = useState<OperatorParcelEvaluation[]>([]);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState<OperatorEvaluationDraft>(() =>
    createDraft(null),
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  function refreshEvaluations() {
    const nextEvaluations = readOperatorParcelEvaluations();

    setEvaluations(nextEvaluations);
    setSelectedEvaluationId((currentValue) => {
      if (currentValue && nextEvaluations.some((item) => item.id === currentValue)) {
        return currentValue;
      }

      return nextEvaluations[0]?.id ?? null;
    });
  }

  useEffect(() => {
    const refreshHandle = window.setTimeout(refreshEvaluations, 0);
    const unsubscribe = subscribeOperatorParcelEvaluations(refreshEvaluations);

    return () => {
      window.clearTimeout(refreshHandle);
      unsubscribe();
    };
  }, []);

  const selectedEvaluation = useMemo(
    () =>
      evaluations.find((evaluation) => evaluation.id === selectedEvaluationId) ??
      evaluations[0] ??
      null,
    [evaluations, selectedEvaluationId],
  );
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

  function handleSelectEvaluation(evaluation: OperatorParcelEvaluation) {
    const reviewedEvaluation =
      markOperatorParcelEvaluationInReview(evaluation.id) ?? evaluation;

    setSelectedEvaluationId(reviewedEvaluation.id);
    setDraft(createDraft(reviewedEvaluation));
    setFeedback(null);
    refreshEvaluations();
  }

  function handleDraftChange<K extends keyof OperatorEvaluationDraft>(
    field: K,
    value: OperatorEvaluationDraft[K],
  ) {
    setDraft((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
    setFeedback(null);
  }

  function handleToggleWarning(warning: OperatorParcelWarning) {
    setDraft((currentValue) => ({
      ...currentValue,
      warnings: currentValue.warnings.includes(warning)
        ? currentValue.warnings.filter((item) => item !== warning)
        : [...currentValue.warnings, warning],
    }));
    setFeedback(null);
  }

  function handleSendQuestion() {
    if (!selectedEvaluation) {
      return;
    }

    const result = addOperatorParcelEvaluationQuestion({
      evaluationId: selectedEvaluation.id,
      question: draft.question,
    });

    if (!result.ok) {
      setFeedback(
        result.reason === "active_question_exists"
          ? "Exista deja o intrebare fara raspuns."
          : "Intrebarea nu poate fi trimisa pentru aceasta evaluare.",
      );
      return;
    }

    setSelectedEvaluationId(result.evaluation.id);
    setDraft((currentValue) => ({ ...currentValue, question: "" }));
    setFeedback("Intrebarea a fost trimisa clientului.");
    refreshEvaluations();
  }

  function handleSaveProfile() {
    if (!selectedEvaluation) {
      return;
    }

    const weightKg = parsePositiveNumber(draft.weightKg);
    const lengthCm = parsePositiveNumber(draft.lengthCm);
    const widthCm = parsePositiveNumber(draft.widthCm);
    const heightCm = parsePositiveNumber(draft.heightCm);

    if (!weightKg || !lengthCm || !widthCm || !heightCm) {
      setFeedback("Completeaza greutatea si toate dimensiunile cu valori pozitive.");
      return;
    }

    const result = finalizeOperatorParcelEvaluation({
      evaluationId: selectedEvaluation.id,
      profile: {
        weightKg,
        lengthCm,
        widthCm,
        heightCm,
        warnings: draft.warnings,
      },
    });

    if (!result.ok) {
      setFeedback("Profilul nu poate fi salvat pentru aceasta evaluare.");
      return;
    }

    setSelectedEvaluationId(result.evaluation.id);
    setDraft(createDraft(result.evaluation));
    setFeedback("Profilul a fost salvat si va fi aplicat automat pe pagina clientului.");
    refreshEvaluations();
  }

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Operator"
        title="Evaluare colete"
        description="Lista cererilor trimise din pasul coletului. Deschide o cerere, pune intrebari clientului si salveaza profilul final."
        actions={
          <AppButton type="button" variant="outline" onClick={refreshEvaluations}>
            <RefreshCw className="size-4" />
            Actualizeaza
          </AppButton>
        }
      />

      {evaluations.length === 0 ? (
        <EmptyState
          title="Nu exista evaluari de colet"
          description="Cand un client apasa Cere evaluare operator, cererea apare aici impreuna cu descrierea folosita pentru AI."
          icon={<PackageSearch className="size-6" />}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(18rem,0.45fr)_minmax(0,1fr)]">
          <Card className="rounded-[calc(var(--radius)+0.5rem)]">
            <CardContent className="grid gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">Toate evaluarile</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {evaluations.length} cereri salvate in acest browser.
                  </p>
                </div>
                <StatusBadge
                  label={`${evaluations.filter((item) => item.status !== "finalized" && item.status !== "closed").length} active`}
                  tone="info"
                />
              </div>

              <div className="grid gap-2">
                {evaluations.map((evaluation) => (
                  <button
                    key={evaluation.id}
                    type="button"
                    onClick={() => handleSelectEvaluation(evaluation)}
                    className={cn(
                      "grid gap-2 rounded-[calc(var(--radius)+0.35rem)] border p-3 text-left transition-colors hover:border-primary/45 hover:bg-secondary/30",
                      selectedEvaluation?.id === evaluation.id
                        ? "border-primary/45 bg-primary/10"
                        : "border-border/75 bg-card",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {evaluation.sessionId}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {evaluation.initialDescription}
                        </p>
                      </div>
                      <StatusBadge
                        label={operatorParcelEvaluationStatusLabels[evaluation.status]}
                        tone={getEvaluationTone(evaluation)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{evaluation.questions.length} intrebari</span>
                      <span>Actualizat: {formatDateTime(evaluation.updatedAt)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedEvaluation ? (
            <Card className="rounded-[calc(var(--radius)+0.5rem)]">
              <CardContent className="grid gap-5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                      <MessageSquareText className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-2xl tracking-tight text-foreground">
                        Cerere {selectedEvaluation.id}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Creata: {formatDateTime(selectedEvaluation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    label={operatorParcelEvaluationStatusLabels[selectedEvaluation.status]}
                    tone={getEvaluationTone(selectedEvaluation)}
                  />
                </div>

                <div className="grid gap-3 rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Mesajul initial folosit pentru AI
                  </p>
                  <p className="text-sm leading-7 text-foreground">
                    {selectedEvaluation.initialDescription}
                  </p>
                </div>

                {selectedEvaluation.estimateTrace ? (
                  <ParcelEstimateTracePanel
                    estimateTrace={selectedEvaluation.estimateTrace}
                  />
                ) : null}

                <div className="grid gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Intrebari si raspunsuri
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
                          {question.answer
                            ? `Raspuns client: ${question.answer}`
                            : "Asteapta raspunsul clientului."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[calc(var(--radius)+0.35rem)] border border-border/75 bg-secondary/25 p-4 text-sm leading-6 text-muted-foreground">
                      Nu ai trimis inca nicio intrebare pentru aceasta cerere.
                    </div>
                  )}
                </div>

                <div className="grid gap-3 rounded-[calc(var(--radius)+0.45rem)] border border-border/75 bg-background/65 p-4">
                  <label className="grid gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Intrebare noua pentru client
                    </span>
                    <textarea
                      value={draft.question}
                      rows={3}
                      placeholder="Ex: Ce model exact este telefonul si are husa sau cutie originala?"
                      onChange={(event) =>
                        handleDraftChange("question", event.target.value)
                      }
                      className="min-h-24 w-full resize-y rounded-[var(--ui-radius-card)] border border-input bg-card px-4 py-3 text-sm leading-6 outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-primary/15 focus-visible:ring-4 focus-visible:ring-ring"
                    />
                  </label>
                  <AppButton
                    type="button"
                    variant="outline"
                    className="w-full sm:w-fit"
                    onClick={handleSendQuestion}
                    disabled={!canSendQuestion}
                  >
                    <Send className="size-4" />
                    Mai adauga o intrebare
                  </AppButton>
                  {activeQuestion ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      Exista deja o intrebare activa. Trimite alta dupa ce clientul
                      raspunde.
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 rounded-[calc(var(--radius)+0.45rem)] border border-border/75 bg-background/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Profil final colet
                  </p>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {[
                      ["weightKg", "Greutate kg"],
                      ["lengthCm", "Lungime cm"],
                      ["widthCm", "Latime cm"],
                      ["heightCm", "Inaltime cm"],
                    ].map(([field, label]) => (
                      <label key={field} className="grid gap-2">
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                        <input
                          type="number"
                          min="0.1"
                          step={field === "weightKg" ? "0.1" : "1"}
                          value={draft[field as keyof OperatorEvaluationDraft] as string}
                          onChange={(event) =>
                            handleDraftChange(
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
                    {warningOptions.map((warning) => (
                      <label
                        key={warning}
                        className="flex min-h-10 items-center gap-2 rounded-2xl border border-border/80 bg-card px-3 text-sm text-foreground"
                      >
                        <input
                          type="checkbox"
                          checked={draft.warnings.includes(warning)}
                          onChange={() => handleToggleWarning(warning)}
                          className="size-4 accent-primary"
                        />
                        {operatorParcelWarningLabels[warning]}
                      </label>
                    ))}
                  </div>

                  <AppButton
                    type="button"
                    className="w-full sm:w-fit"
                    onClick={handleSaveProfile}
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
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
