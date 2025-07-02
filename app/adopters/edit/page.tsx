"use client"
import type React from "react"
import { useState } from "react"
import Navbar from "@/lib/components/Navbar"
import { Edit, Search, Save, X, Check } from "lucide-react"
import axios from "axios"
import type { Adopter } from "@/lib/schemas/adopter"

export default function EditAdopter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [adopters, setAdopters] = useState<Adopter[]>([])
  const [selectedAdopter, setSelectedAdopter] = useState<Adopter | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const searchAdopters = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const { data } = await axios.get("/api/get/adopter", {
        params: { name: searchTerm },
      })
      setAdopters(data)
    } catch (err) {
      setError("Failed to search adopters")
    } finally {
      setLoading(false)
    }
  }

  const selectAdopter = (adopter: Adopter) => {
    setSelectedAdopter(adopter)
    setFormData({
      adopter_email: adopter.adopter_email,
      name: adopter.name,
      age: adopter.age?.toString() || "",
      city: adopter.city || "",
      previous_pets: adopter.previous_pets?.toString() || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdopter) return

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const submitData = {
        _id: (selectedAdopter as any)._id,
        city: formData.city || undefined,
        previous_pets: formData.previous_pets ? Number.parseInt(formData.previous_pets) : undefined,
      }

      await axios.patch("/api/update/adopter", submitData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update adopter")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Adopter</h1>
          <p className="text-gray-600">Search for an adopter and update their information</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Adopter updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <X className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Adopter</h2>

            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchAdopters()}
                  placeholder="Search by adopter name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={searchAdopters}
                disabled={loading || !searchTerm.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Search
              </button>
            </div>

            {adopters.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adopters.map((adopter, index) => (
                  <div
                    key={index}
                    onClick={() => selectAdopter(adopter)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAdopter === adopter
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{adopter.name}</h3>
                      <p className="text-sm text-gray-600">{adopter.adopter_email}</p>
                      {adopter.city && <p className="text-sm text-gray-500">{adopter.city}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Adopter Information</h2>

            {selectedAdopter ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={formData.adopter_email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (Read-only)</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (Read-only)</label>
                  <input
                    type="text"
                    value={formData.age || "Not specified"}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Pets</label>
                  <input
                    type="number"
                    name="previous_pets"
                    value={formData.previous_pets || ""}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of previous pets"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Adopter"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Edit className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Search and select an adopter to edit</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
