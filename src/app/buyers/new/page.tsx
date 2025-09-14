"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buyerSchemaRefined, type BuyerInput } from "@/lib/validation/newBuyer";
import { User,Mail,Phone,MapPin,Home,DollarSign,Calendar,Tag,FileText,Clock,AlertCircle, Save,ArrowLeft,Plus,UserPlus
} from "lucide-react";

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
        return router.replace("/");
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
        setErrors({});

        const parsed = buyerSchemaRefined.safeParse(formData);

        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.issues.forEach((err) => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
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
                setErrors({ submit: err.message || "Something went wrong" });
            }
        } catch (error) {
            setErrors({ submit: "Network error. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.05),transparent_50%)]"></div>
            
            <div className="relative max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/buyers")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Buyers
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    Create New Lead
                                </h1>
                                <p className="text-gray-600 mt-1">Add a new buyer lead to your database</p>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            <UserPlus className="w-4 h-4" />
                            New Entry
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Error Display */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <h3 className="text-sm font-semibold text-red-700">Please fix the following errors:</h3>
                                </div>
                                <ul className="space-y-1 text-sm text-red-600">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field} className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                            {message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Basic Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                            placeholder="Enter full name"
                                            required
                                        />
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.fullName && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.fullName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                            placeholder="Enter email address"
                                        />
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.email && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Phone *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                            placeholder="Enter phone number"
                                            required
                                        />
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.phone && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">City *</label>
                                    <div className="relative">
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            required
                                        >
                                            <option value="">Select City</option>
                                            <option>Chandigarh</option>
                                            <option>Mohali</option>
                                            <option>Zirakpur</option>
                                            <option>Panchkula</option>
                                            <option>Other</option>
                                        </select>
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Home className="w-5 h-5 text-indigo-600" />
                                Property Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Property Type *</label>
                                    <div className="relative">
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            required
                                        >
                                            <option>Apartment</option>
                                            <option>Villa</option>
                                            <option>Plot</option>
                                            <option>Office</option>
                                            <option>Retail</option>
                                        </select>
                                        <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {(formData.propertyType === "Apartment" || formData.propertyType === "Villa") && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">BHK *</label>
                                        <div className="relative">
                                            <select
                                                name="bhk"
                                                value={formData.bhk ? REVERSE_BHK_MAP[formData.bhk] : ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                                required
                                            >
                                                <option value="">Select BHK</option>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>Studio</option>
                                            </select>
                                            <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                        {errors.bhk && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.bhk}</p>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Purpose *</label>
                                    <div className="relative">
                                        <select
                                            name="purpose"
                                            value={formData.purpose}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            required
                                        >
                                            <option value="">Select Purpose</option>
                                            <option>Buy</option>
                                            <option>Rent</option>
                                        </select>
                                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Budget & Timeline Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Budget & Timeline
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Budget Min</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="budgetMin"
                                            value={formData.budgetMin ?? ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                            placeholder="Minimum budget"
                                        />
                                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Budget Max</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="budgetMax"
                                            value={formData.budgetMax ?? ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                            placeholder="Maximum budget"
                                        />
                                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    {errors.budgetMax && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.budgetMax}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Timeline *</label>
                                    <div className="relative">
                                        <select
                                            name="timeline"
                                            value={REVERSE_TIMELINE_MAP[formData.timeline] || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            required
                                        >
                                            <option value="">Select Timeline</option>
                                            <option>0-3 Months</option>
                                            <option>3-6 Months</option>
                                            <option>{">"}6 Months</option>
                                            <option>Exploring</option>
                                        </select>
                                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Source *</label>
                                    <div className="relative">
                                        <select
                                            name="source"
                                            value={REVERSE_SOURCE_MAP[formData.source] || ""}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            required
                                        >
                                            <option value="">Select Source</option>
                                            <option>Website</option>
                                            <option>Referral</option>
                                            <option>Walk In</option>
                                            <option>Call</option>
                                            <option>Other</option>
                                        </select>
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Additional Info Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                Status & Additional Information
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                        >
                                            <option>New</option>
                                            <option>Qualified</option>
                                            <option>Contacted</option>
                                            <option>Visited</option>
                                            <option>Negotiation</option>
                                            <option>Converted</option>
                                            <option>Dropped</option>
                                        </select>
                                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <div className="relative">
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm resize-none"
                                            placeholder="Add any additional notes about this lead..."
                                        />
                                        <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="tags"
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))
                                            }
                                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                            placeholder="Enter tags separated by commas (e.g., urgent, premium, referral)"
                                        />
                                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 cursor-pointer sm:flex-none sm:px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Lead...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Create Lead
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/buyers")}
                                className="flex-1 cursor-pointer sm:flex-none sm:px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 flex items-center justify-center gap-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}