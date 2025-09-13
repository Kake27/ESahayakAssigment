"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buyerSchemaRefined, type BuyerInput } from "@/lib/validation/newBuyer";


export default function NewBuyer() {
    const {user} = useUser();
    const router = useRouter();


    if(!user) { 
        return router.push("/login");
    }
    
    const [formData, setFormData] = useState<BuyerInput>({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        propertyType: "Apartment",
        bhk: "",
        purpose: "",
        budgetMin: undefined,
        budgetMax: undefined,
        timeline: "",
        source: "",
        notes: "",
        tags: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: name.includes("budget") ? (value ? Number(value) : undefined) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = buyerSchemaRefined.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log(parsed.data)

    const res = await fetch("/api/buyers/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...parsed.data,
                ownerId: user?.id
            }),
        });

        if (res.ok) {
            router.push("/buyers");
        } else {
            const err = await res.json();
            alert(err.message || "Something went wrong");
        }
    };


    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Lead</h1>
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
                    value={formData.email}
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
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
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
                    <option>Land</option>
                    <option>Other</option>
                </select>
                </div>

                {/* BHK (conditional) */}
                {(formData.propertyType === "Apartment" || formData.propertyType === "Villa") && (
                <div>
                    <label className="block">BHK</label>
                    <input
                    type="text"
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    />
                    {errors.bhk && <p className="text-red-500">{errors.bhk}</p>}
                </div>
                )}

                {/* Purpose */}
                <div>
                <label className="block">Purpose</label>
                <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
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
                <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                </div>

                {/* Source */}
                <div>
                <label className="block">Source</label>
                <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                </div>

                {/* Notes */}
                <div>
                <label className="block">Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes}
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
                    onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))
                    }
                    className="border p-2 w-full"
                />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Create Lead
                </button>
            </form>
    </div>
    )
}