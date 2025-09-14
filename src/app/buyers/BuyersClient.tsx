"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BuyersClientProps {
  buyers: any[];
  totalPages: number;
  currentPage: number;
  params: Record<string, string | undefined>;
}

export default function BuyersClient({
  buyers,
  totalPages,
  currentPage,
  params,
}: BuyersClientProps) {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleCreateLead = () => {
    router.push("/buyers/new");
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Buyer Leads</h1>
      <button onClick={handleCreateLead} className="mb-4">
        Create new lead
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
        <button
          type="submit"
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          Apply
        </button>
      </form>

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
              <td className="border px-2 py-1">{buyer.timeline}</td>
              <td className="border px-2 py-1">{buyer.status}</td>
              <td className="border px-2 py-1">
                {new Date(buyer.updatedAt).toLocaleDateString()}
              </td>
              <td className="border px-2 py-1">
                <Link
                  href={`/buyers/${buyer.id}`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
                {buyer.ownerId === user?.id && (
                  <Link
                    href={`/buyers/${buyer.id}/edit`}
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
