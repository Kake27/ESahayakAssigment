import { describe, it, expect } from "vitest";
import { buyerSchemaRefined } from "../lib/validation/newBuyer";

describe("buyerSchemaRefined", () => {
    it("should pass with valid buyer data", () => {
    const result = buyerSchemaRefined.safeParse({
      fullName: "John Doe",
      phone: "9876543210",
      city: "Chandigarh",
      propertyType: "Plot",
      purpose: "Buy",
      timeline: "M0_3",
      source: "Website",
      status: "New",
      budgetMin: 100000,
      budgetMax: 200000,
    });

    expect(result.success).toBe(true);
  });

  it("should fail when budgetMax < budgetMin", () => {
    const result = buyerSchemaRefined.safeParse({
      fullName: "John Doe",
      phone: "9876543210",
      city: "Chandigarh",
      propertyType: "Plot",
      purpose: "Buy",
      timeline: "M0_3",
      source: "Website",
      status: "New",
      budgetMin: 300000,
      budgetMax: 200000,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("budgetMax must be greater");
    }
  });

  it("should fail when bhk missing for Apartment", () => {
    const result = buyerSchemaRefined.safeParse({
      fullName: "Jane Doe",
      phone: "9876543210",
      city: "Mohali",
      propertyType: "Apartment",
      purpose: "Rent",
      timeline: "Exploring",
      source: "Referral",
      status: "New",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("bhk"))).toBe(true);
    }
  });

  it("should pass when bhk is provided for Apartment", () => {
    const result = buyerSchemaRefined.safeParse({
      fullName: "Jane Doe",
      phone: "9876543210",
      city: "Mohali",
      propertyType: "Apartment",
      bhk: "Two",
      purpose: "Rent",
      timeline: "Exploring",
      source: "Referral",
      status: "New",
    });

    expect(result.success).toBe(true);
  });
})