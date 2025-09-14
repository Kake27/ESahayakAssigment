"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Users,Plus,Upload,Download,LogOut,Search,Filter,Eye,Edit,AlertCircle,Calendar,Phone,MapPin,Home,DollarSign} from "lucide-react";

interface BuyersClientProps {
  buyers: any[];
  totalPages: number;
  currentPage: number;
  params: Record<string, string | undefined>;
}

const REVERSE_TIMELINE_MAP: Record<string, string> = {
  "M0_3": "0-3 Months",
  "M3_6": "3-6 Months",
  "M6_plus": ">6 Months",
  "Exploring": "Exploring",
};

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-800 border-blue-200",
  "Qualified": "bg-green-100 text-green-800 border-green-200",
  "Contacted": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Visited": "bg-purple-100 text-purple-800 border-purple-200",
  "Negotiation": "bg-orange-100 text-orange-800 border-orange-200",
  "Converted": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Dropped": "bg-red-100 text-red-800 border-red-200",
};

export default function BuyersClient({buyers, totalPages, currentPage, params}: BuyersClientProps) {
  const { user, loading, logout } = useUser();
  const router = useRouter();

  const [errors, setErrors] = useState<{row:number; message: string}[]>([]);

  const handleCreateLead = () => {
    router.push("/buyers/new");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if(!loading) {
    if(!user) return router.replace("/")
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files?.[0]) return;

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("ownerId", user ? user.id : "")

    const res = await fetch("/api/buyers/import", {
      method: "POST",
      body: formData
    })

    const data = await res.json();
      if (data.errors) {
        setErrors(data.errors);
      } else {
          alert("Import successful!");
          window.location.reload();
      }
  }

  const handleExport = () => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    window.location.href = `/api/buyers/export?${query}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      
      <div className="relative p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Buyer Leads</h1>
                <p className="text-gray-600">Manage and track your buyer prospects</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Logged in as</p>
                  <p className="font-semibold text-gray-700">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleCreateLead}
              className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              Create New Lead
            </button>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 focus-within:ring-4 focus-within:ring-blue-100">
                <Upload className="w-4 h-4" />
                Import CSV
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={handleExport}
              className="flex cursor-pointer items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium transition-all duration-200 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
          </div>
          
          <form method="get" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search</label>
              <div className="relative">
                <input
                  type="text"
                  name="query"
                  defaultValue={params.q}
                  placeholder="Name, phone, email..."
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <div className="relative">
                <select
                  name="city"
                  defaultValue={params.city || ""}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                >
                  <option value="">All Cities</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Zirakpur">Zirakpur</option>
                  <option value="Panchkula">Panchkula</option>
                  <option value="Other">Other</option>
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Property Type</label>
              <div className="relative">
                <select
                  name="propertyType"
                  defaultValue={params.propertyType || ""}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                </select>
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Timeline</label>
              <div className="relative">
                <select
                  name="timeline"
                  defaultValue={params.timeline || ""}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm appearance-none"
                >
                  <option value="">All Timelines</option>
                  <option value="M0_3">0-3 Months</option>
                  <option value="M3_6">3-6 Months</option>
                  <option value="M6_plus">{">"}6 Months</option>
                  <option value="Exploring">Exploring</option>
                </select>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                defaultValue={params.status || ""}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 focus:ring-blue-100 bg-white/90 backdrop-blur-sm"
              >
                <option value="">Any Status</option>
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Contacted">Contacted</option>
                <option value="Visited">Visited</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Converted">Converted</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 opacity-0">Apply</label>
              <button
                type="submit"
                className="w-full cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-red-700">Import Errors</h3>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-red-800">Row</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-red-800">Error Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {errors.map((err, i) => (
                    <tr key={i} className="hover:bg-red-50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm font-medium text-red-700">{err.row}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{err.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Budget Range</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Timeline</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Updated</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {buyers.map((buyer, index) => (
                  <tr key={buyer.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {buyer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{buyer.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{buyer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{buyer.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{buyer.propertyType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* <DollarSign className="w-4 h-4 text-gray-400" /> */}
                        <span className="text-sm text-gray-700">
                          {buyer.budgetMin} - {buyer.budgetMax}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{REVERSE_TIMELINE_MAP[buyer.timeline]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[buyer.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(buyer.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/buyers/${buyer.id}?mode=view`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-150"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Link>
                        {buyer.ownerId === user?.id && (
                          <Link
                            href={`/buyers/${buyer.id}?mode=edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-150"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {buyers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No buyer leads found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters or create a new lead</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="  border border-white/20 p-6 mt-1">
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i}
                  href={`/buyers?page=${i + 1}`}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    i + 1 === currentPage 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105" 
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:scale-105"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}