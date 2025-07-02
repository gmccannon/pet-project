"use client"
import type React from "react"
import { useState } from "react"
import Navbar from "@/lib/components/Navbar"
import { Edit, Search, Save, X, Check } from "lucide-react"
import axios from "axios"
import type { Pet } from "@/lib/schemas/pet"

export default function EditPet() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const searchPets = async () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const { data } = await axios.get("/api/get/pet", {
        params: { name: searchTerm },
      })
      setPets(data)
      console.log("Pets found:", data);
    } catch (err) {
      setError("Failed to search pets")
    } finally {
      setLoading(false)
    }
  }

  const selectPet = (pet: Pet) => {
    setSelectedPet(pet)
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      age_years: pet.age_years?.toString() || "",
      gender: pet.gender || "",
      color: pet.color || "",
      arrival_date: pet.arrival_date ? new Date(pet.arrival_date).toISOString().split("T")[0] : "",
      adoption: {
        status: pet.adoption.status,
        date: pet.adoption.date ? new Date(pet.adoption.date).toISOString().split("T")[0] : "",
        adopter_email: pet.adoption.adopter_email || "",
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPet) return

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const submitData = {
        _id: (selectedPet as any)._id,
        ...formData,
        age_years: formData.age_years ? Number.parseInt(formData.age_years) : undefined,
        arrival_date: formData.arrival_date ? new Date(formData.arrival_date).toISOString() : undefined,
        adoption: {
          status: formData.adoption.status,
          date:
            formData.adoption.status && formData.adoption.date ? new Date(formData.adoption.date).toISOString() : null,
          adopter_email: formData.adoption.status ? formData.adoption.adopter_email : undefined,
        },
      }

      console.log("Submitting data:", submitData);

      await axios.patch("/api/update/pet", submitData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update pet")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name.startsWith("adoption.")) {
      const adoptionField = name.split(".")[1]
      setFormData((prev: any) => ({
        ...prev,
        adoption: {
          ...prev.adoption,
          [adoptionField]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        },
      }))
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Pet</h1>
          <p className="text-gray-600">Search for a pet and update their information</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Pet updated successfully!</span>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Pet</h2>

            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchPets()}
                  placeholder="Search by pet name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={searchPets}
                disabled={loading || !searchTerm.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Search
              </button>
            </div>

            {pets.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pets.map((pet, index) => (
                  <div
                    key={index}
                    onClick={() => selectPet(pet)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPet === pet ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{pet.name}</h3>
                        <p className="text-sm text-gray-600">
                          {pet.species} • {pet.breed}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pet.adoption.status ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {pet.adoption.status ? "Adopted" : "Available"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Pet Information</h2>

            {selectedPet ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                  <select
                    name="species"
                    value={formData.species || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Hamster">Hamster</option>
                    <option value="Rabbit">Rabbit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                  <input
                    type="number"
                    name="age_years"
                    value={formData.age_years || ""}
                    onChange={handleInputChange}
                    min="0"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="adoption.status"
                      checked={formData.adoption?.status || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Adopted</span>
                  </label>
                </div>

                {formData.adoption?.status && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adoption Date</label>
                      <input
                        type="date"
                        name="adoption.date"
                        value={formData.adoption.date || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adopter Email</label>
                      <input
                        type="email"
                        name="adoption.adopter_email"
                        value={formData.adoption.adopter_email || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Pet"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Edit className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Search and select a pet to edit</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
