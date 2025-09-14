"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { buyerSchema } from "@/lib/validation/newBuyer";
import { buyerSchemaRefined } from "@/lib/validation/newBuyer";
import type { Buyer } from "@/generated/prisma";
import { User,Mail, Phone,MapPin,Home,DollarSign,Calendar,Tag,FileText,Clock,AlertCircle, Save,ArrowLeft,Edit,Eye,History,
    Trash2,X} from "lucide-react";
import { useUser } from "@/context/UserContext";

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

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800 border-blue-200",
  "Qualified": "bg-green-100 text-green-800 border-green-200",
  "Contacted": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Visited": "bg-purple-100 text-purple-800 border-purple-200",
  "Negotiation": "bg-orange-100 text-orange-800 border-orange-200",
  "Converted": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Dropped": "bg-red-100 text-red-800 border-red-200",
};

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

    const {user} = useUser()

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
            const parsed = buyerSchemaRefined.safeParse(formData);

            if(!parsed.success) {
                const messages = parsed.error.issues.map((err) => err.message).join("\n ");
                setError(messages);
                return;
            }

            const res = await fetch(`/api/buyers/${buyer.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    ...formData,
                    updatedAt: buyer.updatedAt, 
                    changedBy: user?.name
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

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/buyers/${buyer.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/buyers");
            } else {
                const data = await res.json();
                setError(data.error || "Failed to delete buyer");
                setShowDeleteModal(false);
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.05),transparent_50%)]"></div>
            
            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/buyers")}
                                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-gray-700 hover:bg-white/90 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Buyers
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {buyer.fullName.charAt(0).toUpperCase()}
                                    </div>
                                    {buyer.fullName}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {mode === "view" ? "Viewing buyer details" : "Editing buyer information"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {mode === "view" ? (
                                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                    <Eye className="w-4 h-4" />
                                    View Mode
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                    <Edit className="w-4 h-4" />
                                    Edit Mode
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* View Mode */}
                {mode === "view" ? (
                    <div className="space-y-6">
                        {/* Basic Information Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-semibold text-gray-900">{buyer.fullName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold text-gray-900">{buyer.email || "Not provided"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold text-gray-900">{buyer.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">City</p>
                                        <p className="font-semibold text-gray-900">{buyer.city}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Home className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Property Type</p>
                                        <p className="font-semibold text-gray-900">{buyer.propertyType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <Home className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">BHK</p>
                                        <p className="font-semibold text-gray-900">{REVERSE_BHK_MAP[buyer.bhk] || "Not specified"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Purchase Details Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Purchase Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Tag className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Purpose</p>
                                        <p className="font-semibold text-gray-900">{buyer.purpose}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Budget Range</p>
                                        <p className="font-semibold text-gray-900">{buyer.budgetMin} - {buyer.budgetMax}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Timeline</p>
                                        <p className="font-semibold text-gray-900">{REVERSE_TIMELINE_MAP[buyer.timeline]}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Source</p>
                                        <p className="font-semibold text-gray-900">{REVERSE_SOURCE_MAP[buyer.source] || buyer.source}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Additional Info Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                Status & Additional Information
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[buyer.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                            {buyer.status}
                                        </span>
                                    </div>
                                </div>
                                {buyer.notes && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Notes</p>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-gray-700">{buyer.notes}</p>
                                        </div>
                                    </div>
                                )}
                                {buyer.tags && buyer.tags.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {buyer.tags.map((tag: string, index: number) => (
                                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History Card */}
                        {history && history.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <History className="w-5 h-5 text-gray-600" />
                                    Change History (Last 5 Changes)
                                </h2>
                                <div className="space-y-4">
                                    {history.map((h) => (
                                        <div key={h.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-medium text-gray-900">{h.changedBy}</span>
                                                <span className="text-sm text-gray-500">{new Date(h.changedAt).toLocaleString()}</span>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 overflow-x-auto">
                                                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{JSON.stringify(h.diff, null, 2)}</pre>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className="text-sm text-red-700 font-medium whitespace-pre-line">{error}</p>
                                    </div>
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
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                                placeholder="Enter full name"
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
                                                value={formData.email || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                                placeholder="Enter email address"
                                            />
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                        {errors.email && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                                placeholder="Enter phone number"
                                            />
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                        {errors.phone && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <div className="relative">
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            >
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
                                        <label className="block text-sm font-medium text-gray-700">Property Type</label>
                                        <div className="relative">
                                            <select
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
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
                                            <label className="block text-sm font-medium text-gray-700">BHK</label>
                                            <div className="relative">
                                                <select
                                                    name="bhk"
                                                    value={formData.bhk ? REVERSE_BHK_MAP[formData.bhk] : ""}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
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
                                        <label className="block text-sm font-medium text-gray-700">Purpose</label>
                                        <div className="relative">
                                            <select
                                                name="purpose"
                                                value={formData.purpose}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            >
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
                                        <label className="block text-sm font-medium text-gray-700">Timeline</label>
                                        <div className="relative">
                                            <select
                                                name="timeline"
                                                value={REVERSE_TIMELINE_MAP[formData.timeline] || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            >
                                                <option>0-3 Months</option>
                                                <option>3-6 Months</option>
                                                <option>{">"}6 Months</option>
                                                <option>Exploring</option>
                                            </select>
                                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Source</label>
                                        <div className="relative">
                                            <select
                                                name="source"
                                                value={REVERSE_SOURCE_MAP[formData.source] || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                                            >
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
                                                value={formData.notes || ""}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm resize-none"
                                                placeholder="Add any additional notes..."
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
                                                value={formData.tags?.join(", ") || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                    ...prev,
                                                    tags: e.target.value.split(",").map((t) => t.trim()),
                                                    }))
                                                }
                                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                                                placeholder="Enter tags separated by commas"
                                            />
                                            <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <input type="hidden" name="updatedAt" value={buyer.updatedAt} />

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                
                                <button
                                    type="submit"
                                    className="flex-1 cursor-pointer sm:flex-none sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Update Buyer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex-1 cursor-pointer sm:flex-none sm:px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold transition-all duration-200 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete Lead
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

                        {showDeleteModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">Delete Lead</h3>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="w-8 h-8 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                                        >
                                            <X className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <p className="text-gray-700 mb-2">
                                            Are you sure you want to delete <strong>{buyer.fullName}</strong>?
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            This action will permanently delete the buyer lead and all associated history. This cannot be undone.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="flex-1 cursor-pointer bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Deleting...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete Lead
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            disabled={isDeleting}
                                            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}  
                    </div>
                )}
                
            </div>
        </div>
    );
}