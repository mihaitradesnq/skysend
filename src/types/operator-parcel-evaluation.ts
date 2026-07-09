import type {
  ParcelCategory,
  ParcelFragileLevel,
  ParcelPackagingType,
  ParcelSizeOption,
} from "@/types/parcel-assistant";

export type OperatorParcelEvaluationStatus =
  | "in_evaluation"
  | "waiting_customer"
  | "customer_replied"
  | "finalized"
  | "closed";

export type OperatorParcelWarning =
  | "fragile"
  | "temperature"
  | "liquid"
  | "humidity"
  | "orientation";

export type OperatorParcelQuestion = {
  id: string;
  question: string;
  answer: string | null;
  askedAt: string;
  answeredAt: string | null;
};

export type OperatorParcelProfile = {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  warnings: OperatorParcelWarning[];
};

export type OperatorParcelSnapshot = {
  category: ParcelCategory;
  packaging: ParcelPackagingType;
  approximateSize: ParcelSizeOption;
  fragilityLevel: ParcelFragileLevel;
};

export type OperatorParcelEvaluation = {
  id: string;
  sessionId: string;
  orderId: string | null;
  initialDescription: string;
  status: OperatorParcelEvaluationStatus;
  questions: OperatorParcelQuestion[];
  parcelSnapshot: OperatorParcelSnapshot;
  profile: OperatorParcelProfile | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  appliedAt: string | null;
};
