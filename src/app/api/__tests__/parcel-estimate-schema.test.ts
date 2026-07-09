import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/ai", () => ({
  estimateParcelForDispatch: vi.fn(),
}));

const { parcelEstimateRequestSchema } = await import(
  "@/lib/ai/parcel-estimate-route"
);

describe("parcel-estimate POST schema", () => {
  it("accepts a minimal valid request with just `contents`", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      contents: "două cărți într-un pachet",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a fully populated request with advancedDetails", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      contentDescription: "două cărți într-un pachet",
      packaging: "boxed",
      approximateSize: "small",
      advancedDetails: {
        declaredWeightKg: 1.4,
        declaredDimensionsCm: { lengthCm: 25, widthCm: 18, heightCm: 8 },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a request with no description at all", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      packaging: "boxed",
      approximateSize: "small",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative declared weight", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      contents: "ceva",
      advancedDetails: { declaredWeightKg: -1 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects declared dimensions with a zero side", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      contents: "ceva",
      advancedDetails: {
        declaredDimensionsCm: { lengthCm: 25, widthCm: 0, heightCm: 8 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown packaging values", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      contents: "ceva",
      packaging: "wooden_crate",
    });
    expect(result.success).toBe(false);
  });

  it("rejects contents longer than 2000 chars", () => {
    const result = parcelEstimateRequestSchema.safeParse({
      contents: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});
