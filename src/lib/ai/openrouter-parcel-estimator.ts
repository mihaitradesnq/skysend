import "server-only";
import { droneClassLabels } from "@/constants/domain";
import {
  parcelPackagingLabels,
  parcelSizeLabels,
  parcelSizeWeightRanges,
} from "@/constants/parcel-assistant";
import type { DroneClass } from "@/types/domain";
import type { ParcelEstimatorRequest } from "@/types/parcel-estimator";
import type { ProductLookupResult } from "@/types/parcel-intelligence";

const OPENROUTER_CHAT_COMPLETIONS_URL =
  "https://openrouter.ai/api/v1/chat/completions";

type OpenRouterChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: {
      content?: string | null;
      reasoning?: string | null;
    };
  }>;
};

type OpenRouterResponseFormat =
  | {
      type: "json_schema";
      json_schema: {
        name: string;
        strict: boolean;
        schema: typeof parcelEstimateSchema;
      };
    }
  | {
      type: "json_object";
    };

const droneClassIds = [
  "light_swift",
  "light_secure",
  "medium_standard",
  "medium_stabilized",
  "medium_long_range",
  "heavy_cargo",
  "heavy_max",
] as const satisfies readonly DroneClass[];

const categoryIds = [
  "documents",
  "retail",
  "food",
  "medical",
  "electronics",
  "special",
] as const;

const packagingIds = [
  "soft_pouch",
  "plastic_bag",
  "boxed",
  "insulated",
  "fragile_protective",
  "heavy_duty",
] as const;

const dimensionsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthCm: { type: "number" },
    widthCm: { type: "number" },
    heightCm: { type: "number" },
  },
  required: ["lengthCm", "widthCm", "heightCm"],
} as const;

const weightRangeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minKg: { type: "number" },
    maxKg: { type: "number" },
    midpointKg: { type: ["number", "null"] },
    label: { type: ["string", "null"] },
    source: {
      type: "string",
      enum: ["user_declared", "openrouter", "local", "operator"],
    },
  },
  required: ["minKg", "maxKg", "midpointKg", "label", "source"],
} as const;

const clarificationQuestionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    question: { type: "string" },
    field: {
      type: "string",
      enum: [
        "contents",
        "category",
        "packaging",
        "weight",
        "dimensions",
        "fragility",
        "handling",
        "weather_sensitivity",
        "other",
      ],
    },
    answerType: {
      type: "string",
      enum: ["text", "single_select", "multi_select", "number", "boolean"],
    },
    options: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "string" },
          label: { type: "string" },
        },
        required: ["value", "label"],
      },
    },
    required: { type: "boolean" },
    blocksConfirmation: { type: "boolean" },
    reason: { type: ["string", "null"] },
  },
  required: [
    "id",
    "question",
    "field",
    "answerType",
    "options",
    "required",
    "blocksConfirmation",
    "reason",
  ],
} as const;

const parcelEstimateSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    detectedItems: {
      type: "array",
      items: { type: "string" },
    },
    detectedItemsDetailed: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          quantity: { type: ["number", "null"] },
          category: { type: ["string", "null"], enum: [...categoryIds, null] },
          materials: { type: "array", items: { type: "string" } },
          estimatedWeightRangeKg: {
            type: ["object", "null"],
            additionalProperties: false,
            properties: {
              minKg: { type: "number" },
              maxKg: { type: "number" },
              midpointKg: { type: ["number", "null"] },
              label: { type: ["string", "null"] },
              source: {
                type: "string",
                enum: ["user_declared", "openrouter", "local", "operator"],
              },
            },
            required: ["minKg", "maxKg", "midpointKg", "label", "source"],
          },
          estimatedDimensionsCm: {
            type: ["object", "null"],
            additionalProperties: false,
            properties: dimensionsSchema.properties,
            required: dimensionsSchema.required,
          },
          confidenceScore: { type: ["number", "null"] },
          evidence: { type: ["string", "null"] },
        },
        required: [
          "label",
          "quantity",
          "category",
          "materials",
          "estimatedWeightRangeKg",
          "estimatedDimensionsCm",
          "confidenceScore",
          "evidence",
        ],
      },
    },
    materials: {
      type: "array",
      items: { type: "string" },
    },
    packagingAssumption: {
      type: "string",
    },
    packagingInference: {
      type: "object",
      additionalProperties: false,
      properties: {
        packagingType: { type: "string", enum: packagingIds },
        assumption: { type: "string" },
        confidenceScore: { type: "number" },
        confidence: { type: "string", enum: ["low", "medium", "high"] },
        alternatives: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              packagingType: { type: "string", enum: packagingIds },
              reason: { type: "string" },
              confidenceScore: { type: "number" },
            },
            required: ["packagingType", "reason", "confidenceScore"],
          },
        },
      },
      required: [
        "packagingType",
        "assumption",
        "confidenceScore",
        "confidence",
        "alternatives",
      ],
    },
    estimatedWeightMin: {
      type: "number",
    },
    estimatedWeightMax: {
      type: "number",
    },
    estimatedWeightRange: weightRangeSchema,
    suggestedDimensionsCm: dimensionsSchema,
    estimatedDimensions: {
      type: "object",
      additionalProperties: false,
      properties: {
        dimensionsCm: dimensionsSchema,
        volumeLiters: { type: "number" },
        source: {
          type: "string",
          enum: ["user_declared", "openrouter", "local", "operator"],
        },
        fitNotes: { type: "array", items: { type: "string" } },
      },
      required: ["dimensionsCm", "volumeLiters", "source", "fitNotes"],
    },
    volumeLiters: {
      type: "number",
    },
    category: {
      type: "string",
      enum: categoryIds,
    },
    confidenceScore: {
      type: "number",
    },
    confidence: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    fragileLevel: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    handlingNotes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: {
            type: "string",
            enum: [
              "fragile",
              "keep_upright",
              "temperature_sensitive",
              "sealed_required",
              "do_not_stack",
              "operator_review",
              "other",
            ],
          },
          label: { type: "string" },
          details: { type: ["string", "null"] },
        },
        required: ["code", "label", "details"],
      },
    },
    weatherSensitivity: {
      type: "object",
      additionalProperties: false,
      properties: {
        rain: { type: "boolean" },
        wind: { type: "boolean" },
        heat: { type: "boolean" },
        cold: { type: "boolean" },
        humidity: { type: "boolean" },
        notes: { type: ["string", "null"] },
      },
      required: ["rain", "wind", "heat", "cold", "humidity", "notes"],
    },
    riskFlags: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: {
            type: "string",
            enum: [
              "overweight",
              "oversize",
              "fragile",
              "restricted_contents",
              "weather_sensitive",
              "low_confidence",
              "needs_clarification",
              "operator_review",
              "other",
            ],
          },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          label: { type: "string" },
          reason: { type: "string" },
        },
        required: ["code", "severity", "label", "reason"],
      },
    },
    clarificationQuestions: {
      type: "array",
      items: clarificationQuestionSchema,
    },
    recommendedDroneClass: {
      type: "string",
      enum: droneClassIds,
    },
    explanation: {
      type: "string",
    },
  },
  required: [
    "detectedItems",
    "detectedItemsDetailed",
    "materials",
    "packagingAssumption",
    "packagingInference",
    "estimatedWeightMin",
    "estimatedWeightMax",
    "estimatedWeightRange",
    "suggestedDimensionsCm",
    "estimatedDimensions",
    "volumeLiters",
    "category",
    "confidenceScore",
    "confidence",
    "fragileLevel",
    "handlingNotes",
    "weatherSensitivity",
    "riskFlags",
    "clarificationQuestions",
    "recommendedDroneClass",
    "explanation",
  ],
} as const;

function getOpenRouterApiKey() {
  return process.env.OPENROUTER_API_KEY?.trim() ?? null;
}

function getOpenRouterModel() {
  return process.env.OPENROUTER_MODEL?.trim() || "openrouter/free";
}

function getOpenRouterModelCandidates() {
  const configuredModel = getOpenRouterModel();
  const fallbackModels = [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
  ];

  return Array.from(new Set([configuredModel, ...fallbackModels]));
}

function getOpenRouterSiteUrl() {
  return process.env.OPENROUTER_SITE_URL?.trim() || "http://localhost:3000";
}

function getOpenRouterAppName() {
  return process.env.OPENROUTER_APP_NAME?.trim() || "SkySend";
}

function getNaturalDescriptionText(input: ParcelEstimatorRequest) {
  return input.naturalDescription?.text.trim() || input.contentDescription.trim();
}

const romanianQuantityTokenPattern =
  "\\d+(?:[.,]\\d+)?|un|una|o|doi|doua|două|trei|patru|cinci|sase|șase|sapte|șapte|opt|noua|nouă|zece";
const explicitLiquidVolumePattern = new RegExp(
  `\\b(${romanianQuantityTokenPattern})\\s*(ml|mililitru|mililitri|l|L|litru|litri|litre|liter|liters)\\b`,
  "i",
);

function buildPromptInput(
  input: ParcelEstimatorRequest,
  lookupEvidence: ProductLookupResult[] = [],
) {
  const description = getNaturalDescriptionText(input);
  const explicitWeightMatch = description.match(
    /(\d+(?:[.,]\d+)?)\s*(kg|kgs|kilogram|kilograms|kilograme|kilo|g|gr|gram|grams|grame)\b/i,
  );
  const explicitLiquidVolumeMatch = description.match(explicitLiquidVolumePattern);

  return {
    naturalDescription: input.naturalDescription ?? {
      text: description,
      locale: "ro-RO",
      source: "customer",
      capturedAt: null,
    },
    contentDescription: description,
    advancedDetails: input.advancedDetails ?? null,
    previousClarificationAnswers: input.previousClarificationAnswers ?? [],
    parcelCategory: input.category,
    packagingType: input.advancedDetails?.packagingType ?? input.packaging,
    packagingLabel:
      parcelPackagingLabels[input.advancedDetails?.packagingType ?? input.packaging],
    approximateSize: input.approximateSize,
    approximateSizeLabel: parcelSizeLabels[input.approximateSize],
    selectedFragility: input.currentFragileLevel ?? null,
    localWeightBaseline: parcelSizeWeightRanges[input.approximateSize],
    explicitWeightFromUser: explicitWeightMatch
      ? `${explicitWeightMatch[1]} ${explicitWeightMatch[2]}`
      : input.advancedDetails?.declaredWeightKg
        ? `${input.advancedDetails.declaredWeightKg} kg`
        : null,
    explicitLiquidVolumeFromUser: explicitLiquidVolumeMatch
      ? `${explicitLiquidVolumeMatch[1]} ${explicitLiquidVolumeMatch[2]}`
      : null,
    productLookupEvidence: lookupEvidence.length
      ? lookupEvidence.map((result) => ({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          confidence: result.confidence,
        }))
      : null,
    hardRules: [
      "Return strictly valid JSON matching the schema.",
      "Use kilograms, centimeters and liters.",
      "Physical quantities are hard constraints. They override product priors, approximate size labels and generic examples.",
      "If the user gives explicit kg or g, treat that value as the source of truth for estimatedWeightMin, estimatedWeightMax and estimatedWeightRange.source=user_declared.",
      "If the user gives liters or ml for a liquid, convert volume to liquid mass first, then add container and packaging weight. Never estimate a full liquid parcel below the liquid mass unless the text clearly says the bottle/container is empty.",
      "Water is about 1.0 kg/L. Therefore a full 2L water bottle cannot weigh 0.6 kg; it must be above 2.0 kg before container and packaging are added.",
      "Use liquid density by substance: apa/apă/water 1.0 kg/L, lapte/milk 1.03 kg/L, suc/juice 1.02 kg/L, ulei/oil 0.92 kg/L, vin/wine 0.95 kg/L.",
      "Add realistic container weight: plastic bottle about 0.05-0.15 kg each; glass bottle or jar about 0.25-0.7 kg each; add a small buffer for cardboard box or bubble wrap if mentioned.",
      "Interpret Romanian quantity words and diacritics: un, o, una=1; doi/două/doua=2; trei=3; patru=4; cinci=5; șase/sase=6; șapte/sapte=7; opt=8; nouă/noua=9; zece=10.",
      "Recognize Romanian liquid patterns such as 'doi litri', 'o sticlă de 2 litri', 'o sticla cu doi litri', 'două sticle de 500 ml', '2 sticle de 2L' and 'bidon de 5 litri'.",
      "For container-count patterns, multiply volume by count: 'două sticle de 500 ml apă' means 2 * 0.5L; '2 sticle de apă de 2L' means 2 * 2L.",
      "Reference checks: one 2L plastic water bottle is around 2.1-2.4 kg; two 2L water bottles are around 4.2-4.8 kg; two 500 ml water bottles are around 1.1-1.5 kg.",
      "Use broad everyday categories: electronics, documents, food, pharmacy or medical, clothing, cosmetics, small tools, liquids, fragile glass or ceramic.",
      "Romanian 'calculator', 'PC', 'desktop', 'laptop', 'monitor', 'tastatura', 'mouse', 'telefon', 'tableta', 'incarcator' and 'cabluri' are electronics, not food.",
      "Do not classify a parcel as food unless the description clearly mentions food, meals, groceries, restaurant/catering, prepared food, fruit, vegetables or similar edible items.",
      "Do not recommend thermal handling just because the category is unclear. Thermal handling is justified for prepared food, temperature-sensitive goods, medicine/pharmacy, perishables or explicit temperature/cold-chain needs.",
      "For electronics without temperature sensitivity, prefer secure or stabilized handling assumptions over active thermal handling.",
      "If a one-word description like 'calculator' is ambiguous, lower confidence and ask whether it is desktop, laptop or accessories before being too certain.",
      "Do not rely on one product example. Estimate from object type, quantity, material, packaging, category and declared hints.",
      "If physical quantities conflict with your general estimate, obey the physical quantity and reduce confidence instead of guessing too low.",
      "If confidence is low or critical data is missing, still return an estimate and include one short clarification question when possible, maximum three if several critical details are missing.",
      "Keep clarification questions calm and specific, not alarming.",
      "When productLookupEvidence is provided, use it to refine detected item labels, materials and confidence, but never use a marketplace shipping weight as the net parcel weight; net weight still obeys declared/explicit weights and physical rules.",
      "A deterministic server-side sanity check has final authority after this response, so keep estimates physically defensible.",
    ],
    allowedDroneClasses: droneClassIds.map((id) => ({
      id,
      label: droneClassLabels[id],
    })),
    outputContract: {
      confidenceScore: "0-100",
      confidence: "low | medium | high",
      fragileLevel: "low | medium | high",
      recommendedDroneClass: droneClassIds,
    },
  };
}

function extractJson(text: string) {
  const trimmedText = text.trim();

  if (trimmedText.startsWith("{") && trimmedText.endsWith("}")) {
    return trimmedText;
  }

  const fencedJson = trimmedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedJson?.[1]) {
    return fencedJson[1].trim();
  }

  const firstBrace = trimmedText.indexOf("{");
  const lastBrace = trimmedText.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmedText.slice(firstBrace, lastBrace + 1);
  }

  return trimmedText;
}

export async function estimateParcelWithOpenRouter(
  input: ParcelEstimatorRequest,
  lookupEvidence: ProductLookupResult[] = [],
): Promise<unknown> {
  const apiKey = getOpenRouterApiKey();

  if (!apiKey) {
    throw new Error("[openrouter] Missing server-only OPENROUTER_API_KEY.");
  }

  const strictResponseFormat = {
    type: "json_schema",
    json_schema: {
      name: "skysend_parcel_intelligence_estimate",
      strict: true,
      schema: parcelEstimateSchema,
    },
  } satisfies OpenRouterResponseFormat;
  const jsonObjectResponseFormat = {
    type: "json_object",
  } satisfies OpenRouterResponseFormat;

  let lastError: Error | null = null;

  for (const model of getOpenRouterModelCandidates()) {
    for (const responseFormat of [strictResponseFormat, jsonObjectResponseFormat]) {
      try {
        const response = await createOpenRouterRequest(
          input,
          responseFormat,
          apiKey,
          model,
          lookupEvidence,
        );

        if (response.status === 400 && responseFormat.type === "json_schema") {
          continue;
        }

        if (!response.ok) {
          lastError = new Error(
            `[openrouter] ${model} failed with status ${response.status}.`,
          );
          continue;
        }

        const payload = (await response.json()) as OpenRouterChatCompletionResponse;
        const message = payload.choices?.[0]?.message;
        const content = message?.content ?? message?.reasoning;

        if (!content) {
          lastError = new Error(`[openrouter] ${model} returned empty content.`);
          continue;
        }

        return JSON.parse(extractJson(content));
      } catch (error) {
        lastError =
          error instanceof Error
            ? error
            : new Error("[openrouter] Parcel intelligence request failed.");
      }
    }
  }

  throw lastError ?? new Error("[openrouter] Parcel intelligence request failed.");
}

function createOpenRouterRequest(
  input: ParcelEstimatorRequest,
  responseFormat: OpenRouterResponseFormat,
  apiKey: string,
  model: string,
  lookupEvidence: ProductLookupResult[],
) {
  return fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getOpenRouterSiteUrl(),
      "X-OpenRouter-Title": getOpenRouterAppName(),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 1800,
      response_format: responseFormat,
      reasoning: {
        exclude: true,
        max_tokens: 0,
      },
      messages: [
        {
          role: "system",
          content:
            "You estimate parcel characteristics for urban drone delivery intake. Return only valid JSON. Physical quantities from the customer are hard constraints: explicit weights are source of truth, and explicit liquid volumes must be converted to mass before adding container and packaging weight. Never estimate a full liquid parcel below its liquid mass. Classify everyday products carefully: Romanian calculator/PC/laptop/monitor/phone/accessories are electronics, not food. Do not assume active thermal handling unless food, medicine, perishable goods or temperature sensitivity is explicit. Provide a structured parcel intelligence profile with realistic weight, dimensions, volume, risks, handling notes, confidenceScore, confidence label, recommended drone class and short clarification questions when useful. If uncertain, lower confidence and ask one calm clarification question, maximum three when needed, instead of guessing too low or overconfidently.",
        },
        {
          role: "user",
          content: JSON.stringify(buildPromptInput(input, lookupEvidence)),
        },
      ],
    }),
  });
}
