"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

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


export default function BuyersClient({buyers,totalPages,currentPage,params}: BuyersClientProps) {
  const { user, loading, logout } = useUser();
  const router = useRouter();

  const [errors, setErrors] = useState<{row:number; message: string}[]>([])

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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Buyer Leads</h1>
      <button onClick={handleCreateLead} className="mb-4">
        Create new lead
      </button>

      <label className="block mb-2 font-medium">Import Buyers (CSV)</label>
      <input type="file" accept=".csv" onChange={handleFileChange} />

      <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Export CSV
      </button>

      {user && (
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-700">Logged in as: {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Filters */}
      <form method="get" className="flex gap-2 mb-4">
        <input
          type="text"
          name="query"
          defaultValue={params.q}
          placeholder="Search name, phone, email"
          className="border px-2 py-1 rounded"
        />
        <select
          name="city"
          defaultValue={params.city || ""}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Cities</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="propertyType"
          defaultValue={params.propertyType || ""}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>

        <select
          name="timeline"
          defaultValue={params.timeline || ""}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          <option value="M0_3">0-3 Months</option>
          <option value="M3_6">3-6 Months</option>
          <option value="M6_plus">{">"}6 Months</option>
          <option value="Exploring">Exploring</option>
        </select>

        <select
          name="status"
          defaultValue={params.status || ""}
          className="border px-2 py-1 rounded"
        >
          <option value="">Any</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Visited">Visited</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Converted">Converted</option>
          <option value="Dropped">Dropped</option>
        </select>


        <button
          type="submit"
          className="px-4 py-1 bg-blue-500 text-white rounded">
          Apply
        </button>
      </form>

      {/* Errors Table */}
      {errors.length > 0 && (
        <table className="mt-4 border w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">Row</th>
              <th className="border px-2 py-1">Error</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{err.row}</td>
                <td className="border px-2 py-1 text-red-600">{err.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">City</th>
            <th className="border px-2 py-1">PropertyType</th>
            <th className="border px-2 py-1">Budget</th>
            <th className="border px-2 py-1">Timeline</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">UpdatedAt</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.id}>
              <td className="border px-2 py-1">{buyer.fullName}</td>
              <td className="border px-2 py-1">{buyer.phone}</td>
              <td className="border px-2 py-1">{buyer.city}</td>
              <td className="border px-2 py-1">{buyer.propertyType}</td>
              <td className="border px-2 py-1">
                {buyer.budgetMin} - {buyer.budgetMax}
              </td>
              <td className="border px-2 py-1">{REVERSE_TIMELINE_MAP[buyer.timeline]}</td>
              <td className="border px-2 py-1">{buyer.status}</td>
              <td className="border px-2 py-1">
                {new Date(buyer.updatedAt).toLocaleDateString()}
              </td>
              <td className="border px-2 py-1">
                <Link
                  href={`/buyers/${buyer.id}?mode=view`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
                {buyer.ownerId === user?.id && (
                  <Link
                    href={`/buyers/${buyer.id}?mode=edit`}
                    className="ml-2 text-green-600 underline"
                  >
                    Edit
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`/buyers?page=${i + 1}`}
            className={`px-2 py-1 border rounded ${
              i + 1 === currentPage ? "bg-gray-200" : ""
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
