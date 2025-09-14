import z from "zod";

export const buyerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  city: z.string().min(1, "City is required"),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "Land", "Other"]),
  bhk: z.string().optional(), 
  purpose: z.string().min(1, "Purpose is required"),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  timeline: z.string().min(1, "Timeline is required"),
  source: z.string().min(1, "Source is required"),
  status: z.enum([
    "New",
    "Qualified",
    "Contacted",
    "Visited",
    "Negotiation",
    "Converted",
    "Dropped",
  ]).default("New"),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const buyerSchemaRefined = buyerSchema
  .refine(
    (data) =>
      !(data.propertyType === "Apartment" || data.propertyType === "Villa") ||
      (data.bhk && data.bhk.trim().length > 0),
    {
      message: "BHK is required for Apartment/Villa",
      path: ["bhk"],
    }
  )
  .refine(
    (data) =>
      !data.budgetMin ||
      !data.budgetMax ||
      data.budgetMax >= data.budgetMin,
    {
      message: "budgetMax must be greater than or equal to budgetMin",
      path: ["budgetMax"],
    }
  );

export type BuyerInput = z.infer<typeof buyerSchemaRefined>;
