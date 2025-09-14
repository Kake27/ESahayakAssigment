"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { buyerSchema } from "@/lib/validation/newBuyer";
import { buyerSchemaRefined } from "@/lib/validation/newBuyer";
import type { Buyer } from "@/generated/prisma";

const REVERSE_BHK_MAP: Record<string, string> = {
  "One": "1",
  "Two": "2",
  "Three": "3",
  "Four": "4",
  "Studio": "Studio",
};

const REVERSE_TIMELINE_MAP: Record<string, string> = {
  "M0_3": "0-3 Months",
  "M3_6": "3-6 Months",
  "M6_plus": ">6 Months",
  "Exploring": "Exploring",
};

const REVERSE_SOURCE_MAP: Record<string, string> = {
  "Walk_in": "Walk In",
};

const BHK_MAP: Record<string, string> = {
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "Studio": "Studio",
};

const TIMELINE_MAP: Record<string, string> = {
    "0-3 Months": "M0_3",
    "3-6 Months": "M3_6",
    ">6 Months": "M6_plus",
    "Exploring": "Exploring",
}

const SOURCE_MAP: Record<string, string> = {
    "Walk In": "Walk_in"
}



export default function BuyerClient({
    buyer, history, mode
    }:{
        buyer: any;
        history: any[];
        mode: "view" | "edit";
    }) {

    const router = useRouter()
    const [formData, setFormData] = useState<Buyer>({...buyer});

    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;
        if (name.includes("budget")) {
            setFormData((prev) => ({
            ...prev,
            [name]: value ? Number(value) : undefined,
            }));
            return;
        }

        if (name === "bhk") {
            value = value ? BHK_MAP[value] : "";
        }

        if (name === "timeline") {
            value = value ? TIMELINE_MAP[value] : "";
        }

        if (name === "source") {
            value = value ? SOURCE_MAP[value] : "";
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            buyerSchemaRefined.safeParse(formData);
            const res = await fetch(`/api/buyers/${buyer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                ...formData,
                updatedAt: buyer.updatedAt, 
                }),
            });

            if (res.ok) {
                router.push("/buyers");
            } else {
                const data = await res.json();
                setError(data.error || "Something went wrong");
            }

        }
        catch (err:any) {
            setError(err.message)
        }
    }



    return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Buyer Details</h1>

      {/* View section */}
      {mode === "view" ? (
        <div className="space-y-2">
          <p><b>Name:</b> {buyer.fullName}</p>
          <p><b>Email:</b> {buyer.email}</p>
          <p><b>Phone:</b> {buyer.phone}</p>
          <p><b>City:</b> {buyer.city}</p>
          <p><b>Property:</b> {buyer.propertyType}</p>
          <p><b>BHK:</b> {REVERSE_BHK_MAP[buyer.bhk] || "-"}</p>
          <p><b>Purpose:</b> {buyer.purpose}</p>
          <p><b>Budget:</b> {buyer.budgetMin} – {buyer.budgetMax}</p>
          <p><b>Timeline:</b> {REVERSE_TIMELINE_MAP[buyer.timeline]}</p>
          <p><b>Source:</b> {REVERSE_SOURCE_MAP[buyer.source]}</p>
          <p><b>Status:</b> {buyer.status}</p>
          <p><b>Notes:</b> {buyer.notes}</p>
          <p><b>Tags:</b> {buyer.tags.join(", ")}</p>

          <h2 className="text-lg font-semibold mt-4">History (last 5 changes)</h2>
          <ul className="list-disc pl-6">
            {history.map((h) => (
              <li key={h.id}>
                {h.changedBy} on {new Date(h.changedAt).toLocaleString()} →{" "}
                <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(h.diff, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      ) : (

        // Edit section
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
            <label className="block">Full Name</label>
            <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="border p-2 w-full"
            />
            {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
            <label className="block">Email</label>
            <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
            <label className="block">Phone</label>
            <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full"
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>

        {/* City */}
        <div>
            <label className="block">City</label>
            <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 w-full"
            >
            <option>Chandigarh</option>
            <option>Mohali</option>
            <option>Zirakpur</option>
            <option>Panchkula</option>
            <option>Other</option>
            </select>
        </div>

        {/* Property Type */}
        <div>
            <label className="block">Property Type</label>
            <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="border p-2 w-full"
            >
            <option>Apartment</option>
            <option>Villa</option>
            <option>Plot</option>
            <option>Office</option>
            <option>Retail</option>
            </select>
        </div>

        {/* BHK (conditional) */}
        {(formData.propertyType === "Apartment" || formData.propertyType === "Villa") && (
            <div>
            <label className="block">BHK</label>
            <select
                name="bhk"
                value={formData.bhk ? REVERSE_BHK_MAP[formData.bhk] : ""}
                onChange={handleChange}
                className="border p-2 w-full"
            >
                <option value="">Select BHK</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>Studio</option>
            </select>
            {errors.bhk && <p className="text-red-500">{errors.bhk}</p>}
            </div>
        )}

        {/* Purpose */}
        <div>
            <label className="block">Purpose</label>
            <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="border p-2 w-full"
            >
            <option>Buy</option>
            <option>Rent</option>
            </select>
        </div>

        {/* Budget */}
        <div className="flex gap-2">
            <div className="flex-1">
            <label className="block">Budget Min</label>
            <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin ?? ""}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            </div>
            <div className="flex-1">
            <label className="block">Budget Max</label>
            <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax ?? ""}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            {errors.budgetMax && <p className="text-red-500">{errors.budgetMax}</p>}
            </div>
        </div>

        {/* Timeline */}
        <div>
            <label className="block">Timeline</label>
            <select
            name="timeline"
            value={REVERSE_TIMELINE_MAP[formData.timeline] || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            >
            <option>0-3 Months</option>
            <option>3-6 Months</option>
            <option>{">"}6 Months</option>
            <option>Exploring</option>
            </select>
        </div>

        {/* Source */}
        <div>
            <label className="block">Source</label>
            <select
            name="source"
            value={REVERSE_SOURCE_MAP[formData.source] || ""}
            onChange={handleChange}
            className="border p-2 w-full"
            >
            <option>Website</option>
            <option>Referral</option>
            <option>Walk In</option>
            <option>Call</option>
            <option>Other</option>
            </select>
        </div>

        {/* Status */}
        <div>
            <label className="block">Status</label>
            <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full"
            >
            <option>New</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Visited</option>
            <option>Negotiation</option>
            <option>Converted</option>
            <option>Dropped</option>
            </select>
        </div>

        {/* Notes */}
        <div>
            <label className="block">Notes</label>
            <textarea
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                className="border p-2 w-full"
            />
        </div>

        {/* Tags */}
        <div>
            <label className="block">Tags (comma separated)</label>
            <input
            type="text"
            name="tags"
            value={formData.tags?.join(", ") || ""}
            onChange={(e) =>
                setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((t) => t.trim()),
                }))
            }
            className="border p-2 w-full"
            />
        </div>

        <input type="hidden" name="updatedAt" value={buyer.updatedAt} />

        {error && <p className="text-red-500">{error}</p>}

        <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Update
        </button>
    </form>

      )}
    </div>
  );
}