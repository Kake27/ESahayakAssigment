"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buyerSchemaRefined, type BuyerInput } from "@/lib/validation/newBuyer";

const BHK_MAP: Record<string, string> = {
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "Studio": "Studio",
};

const REVERSE_BHK_MAP: Record<string, string> = {
  "One": "1",
  "Two": "2",
  "Three": "3",
  "Four": "4",
  "Studio": "Studio",
};

const TIMELINE_MAP: Record<string, string> = {
    "0-3 Months": "M0_3",
    "3-6 Months": "M3_6",
    ">6 Months": "M6_plus",
    "Exploring": "Exploring",
}

const REVERSE_TIMELINE_MAP: Record<string, string> = {
  "M0_3": "0-3 Months",
  "M3_6": "3-6 Months",
  "M6_plus": ">6 Months",
  "Exploring": "Exploring",
};

const SOURCE_MAP: Record<string, string> = {
    "Walk In": "Walk_in"
}

const REVERSE_SOURCE_MAP: Record<string, string> = {
  "Walk_in": "Walk In",
};

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
        status: "New",
        notes: "",
        tags: [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;

        if (name.includes("budget")) {
            setFormData((prev) => ({
                ...prev,
                [name]: value ? Number(value) : undefined
            }))
            return ;
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

    const parsed = buyerSchemaRefined.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // console.log(parsed.data)

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
                    required
                    value={REVERSE_BHK_MAP[formData.bhk] || ""} 
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
                    value={formData.notes}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                </div>


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