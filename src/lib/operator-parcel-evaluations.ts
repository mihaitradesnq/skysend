import type {
  OperatorParcelEvaluation,
  OperatorParcelEvaluationStatus,
  OperatorParcelProfile,
  OperatorParcelSnapshot,
  OperatorParcelWarning,
} from "@/types/operator-parcel-evaluation";

const operatorParcelEvaluationsStorageKey = "skysend:operator-parcel-evaluations";
const operatorParcelEvaluationsChangedEvent =
  "skysend:operator-parcel-evaluations-changed";
const operatorParcelEvaluationsBroadcastChannel =
  "skysend-operator-parcel-evaluations";

export const operatorParcelEvaluationStatusLabels: Record<
  OperatorParcelEvaluationStatus,
  string
> = {
  in_evaluation: "În evaluare",
  waiting_customer: "Așteaptă clientul",
  customer_replied: "Răspuns primit",
  finalized: "Finalizat",
  closed: "Închis",
};

export const operatorParcelWarningLabels: Record<OperatorParcelWarning, string> = {
  fragile: "Fragil",
  temperature: "Sensibil la temperatură",
  liquid: "Conține lichide",
  humidity: "Sensibil la umiditate",
  orientation: "Păstrează orientarea",
};

type CreateOperatorParcelEvaluationInput = {
  sessionId: string;
  orderId?: string | null;
  initialDescription: string;
  parcelSnapshot: OperatorParcelSnapshot;
};

type OperatorParcelEvaluationMutationResult =
  | { ok: true; evaluation: OperatorParcelEvaluation }
  | {
      ok: false;
      reason:
        | "not_found"
        | "storage_unavailable"
        | "active_question_exists"
        | "question_limit_reached"
        | "evaluation_closed";
    };

function hasEvaluationStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createEvaluationId() {
  const entropy =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.floor(Math.random() * 100000000).toString().padStart(8, "0");

  return `ope-${Date.now().toString(36)}-${entropy}`;
}

function readStoredEvaluations() {
  if (!hasEvaluationStorage()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(operatorParcelEvaluationsStorageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as OperatorParcelEvaluation[];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeStoredEvaluations(evaluations: OperatorParcelEvaluation[]) {
  if (!hasEvaluationStorage()) {
    return false;
  }

  window.localStorage.setItem(
    operatorParcelEvaluationsStorageKey,
    JSON.stringify(evaluations),
  );
  window.dispatchEvent(new Event(operatorParcelEvaluationsChangedEvent));

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(operatorParcelEvaluationsBroadcastChannel);
    channel.postMessage({ type: "changed" });
    channel.close();
  }

  return true;
}

function isEvaluationClosed(evaluation: OperatorParcelEvaluation) {
  return evaluation.status === "finalized" || evaluation.status === "closed";
}

function sortEvaluations(
  evaluations: OperatorParcelEvaluation[],
): OperatorParcelEvaluation[] {
  return [...evaluations].sort(
    (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
  );
}

export function subscribeOperatorParcelEvaluations(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const channel =
    "BroadcastChannel" in window
      ? new BroadcastChannel(operatorParcelEvaluationsBroadcastChannel)
      : null;
  const handleBroadcastMessage = () => onStoreChange();

  channel?.addEventListener("message", handleBroadcastMessage);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(operatorParcelEvaluationsChangedEvent, onStoreChange);

  return () => {
    channel?.removeEventListener("message", handleBroadcastMessage);
    channel?.close();
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(operatorParcelEvaluationsChangedEvent, onStoreChange);
  };
}

export function readOperatorParcelEvaluations() {
  return sortEvaluations(readStoredEvaluations());
}

export function readOperatorParcelEvaluation(
  evaluationId: string,
): OperatorParcelEvaluation | null {
  return (
    readStoredEvaluations().find((evaluation) => evaluation.id === evaluationId) ??
    null
  );
}

export function readOperatorParcelEvaluationForSession(sessionId: string) {
  return (
    readOperatorParcelEvaluations().find(
      (evaluation) => evaluation.sessionId === sessionId && !evaluation.appliedAt,
    ) ?? null
  );
}

export function createOperatorParcelEvaluation({
  sessionId,
  orderId = null,
  initialDescription,
  parcelSnapshot,
}: CreateOperatorParcelEvaluationInput): OperatorParcelEvaluation | null {
  if (!hasEvaluationStorage()) {
    return null;
  }

  const evaluations = readStoredEvaluations();
  const existingEvaluation = evaluations.find(
    (evaluation) => evaluation.sessionId === sessionId && !isEvaluationClosed(evaluation),
  );

  if (existingEvaluation) {
    return existingEvaluation;
  }

  const timestamp = new Date().toISOString();
  const evaluation: OperatorParcelEvaluation = {
    id: createEvaluationId(),
    sessionId,
    orderId,
    initialDescription: initialDescription.trim(),
    status: "in_evaluation",
    questions: [],
    parcelSnapshot,
    profile: null,
    createdAt: timestamp,
    updatedAt: timestamp,
    closedAt: null,
    appliedAt: null,
  };

  writeStoredEvaluations([evaluation, ...evaluations]);

  return evaluation;
}

export function deleteOperatorParcelEvaluation(evaluationId: string) {
  const evaluations = readStoredEvaluations();
  const nextEvaluations = evaluations.filter(
    (evaluation) => evaluation.id !== evaluationId,
  );

  if (nextEvaluations.length === evaluations.length) {
    return false;
  }

  return writeStoredEvaluations(nextEvaluations);
}

export function addOperatorParcelEvaluationQuestion({
  evaluationId,
  question,
}: {
  evaluationId: string;
  question: string;
}): OperatorParcelEvaluationMutationResult {
  const evaluations = readStoredEvaluations();
  const evaluation = evaluations.find((item) => item.id === evaluationId);

  if (!evaluation) {
    return { ok: false, reason: "not_found" };
  }

  if (isEvaluationClosed(evaluation)) {
    return { ok: false, reason: "evaluation_closed" };
  }

  if (evaluation.questions.some((item) => !item.answer)) {
    return { ok: false, reason: "active_question_exists" };
  }

  if (evaluation.questions.length >= 3) {
    return { ok: false, reason: "question_limit_reached" };
  }

  const timestamp = new Date().toISOString();
  const updatedEvaluation: OperatorParcelEvaluation = {
    ...evaluation,
    status: "waiting_customer",
    updatedAt: timestamp,
    questions: [
      ...evaluation.questions,
      {
        id: `${evaluation.id}-q${evaluation.questions.length + 1}`,
        question: question.trim(),
        answer: null,
        askedAt: timestamp,
        answeredAt: null,
      },
    ],
  };

  if (
    !writeStoredEvaluations(
      evaluations.map((item) =>
        item.id === updatedEvaluation.id ? updatedEvaluation : item,
      ),
    )
  ) {
    return { ok: false, reason: "storage_unavailable" };
  }

  return { ok: true, evaluation: updatedEvaluation };
}

export function answerOperatorParcelEvaluationQuestion({
  evaluationId,
  answer,
}: {
  evaluationId: string;
  answer: string;
}): OperatorParcelEvaluationMutationResult {
  const evaluations = readStoredEvaluations();
  const evaluation = evaluations.find((item) => item.id === evaluationId);

  if (!evaluation) {
    return { ok: false, reason: "not_found" };
  }

  if (isEvaluationClosed(evaluation)) {
    return { ok: false, reason: "evaluation_closed" };
  }

  const activeQuestion = evaluation.questions.find((question) => !question.answer);

  if (!activeQuestion) {
    return { ok: false, reason: "not_found" };
  }

  const timestamp = new Date().toISOString();
  const updatedEvaluation: OperatorParcelEvaluation = {
    ...evaluation,
    status: "customer_replied",
    updatedAt: timestamp,
    questions: evaluation.questions.map((question) =>
      question.id === activeQuestion.id
        ? {
            ...question,
            answer: answer.trim(),
            answeredAt: timestamp,
          }
        : question,
    ),
  };

  if (
    !writeStoredEvaluations(
      evaluations.map((item) =>
        item.id === updatedEvaluation.id ? updatedEvaluation : item,
      ),
    )
  ) {
    return { ok: false, reason: "storage_unavailable" };
  }

  return { ok: true, evaluation: updatedEvaluation };
}

export function finalizeOperatorParcelEvaluation({
  evaluationId,
  profile,
}: {
  evaluationId: string;
  profile: OperatorParcelProfile;
}): OperatorParcelEvaluationMutationResult {
  const evaluations = readStoredEvaluations();
  const evaluation = evaluations.find((item) => item.id === evaluationId);

  if (!evaluation) {
    return { ok: false, reason: "not_found" };
  }

  if (evaluation.status === "closed") {
    return { ok: false, reason: "evaluation_closed" };
  }

  const timestamp = new Date().toISOString();
  const updatedEvaluation: OperatorParcelEvaluation = {
    ...evaluation,
    status: "finalized",
    profile,
    updatedAt: timestamp,
    closedAt: timestamp,
  };

  if (
    !writeStoredEvaluations(
      evaluations.map((item) =>
        item.id === updatedEvaluation.id ? updatedEvaluation : item,
      ),
    )
  ) {
    return { ok: false, reason: "storage_unavailable" };
  }

  return { ok: true, evaluation: updatedEvaluation };
}

export function markOperatorParcelEvaluationApplied(evaluationId: string) {
  const evaluations = readStoredEvaluations();
  const evaluation = evaluations.find((item) => item.id === evaluationId);

  if (!evaluation) {
    return null;
  }

  const updatedEvaluation: OperatorParcelEvaluation = {
    ...evaluation,
    appliedAt: new Date().toISOString(),
  };

  writeStoredEvaluations(
    evaluations.map((item) =>
      item.id === updatedEvaluation.id ? updatedEvaluation : item,
    ),
  );

  return updatedEvaluation;
}
