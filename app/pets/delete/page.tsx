"use client"
import { useState } from "react"
import Navbar from "@/lib/components/Navbar"
import { Trash2, Search, AlertTriangle, Check, X } from "lucide-react"
import axios from "axios"
import type { Pet } from "@/lib/schemas/pet"

export default function DeletePet() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
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
    } catch (err) {
      setError("Failed to search pets")
    } finally {
      setLoading(false)
    }
  }

  const selectPet = (pet: Pet) => {
    setSelectedPet(pet)
    setShowConfirm(false)
  }

  const handleDelete = async () => {
    if (!selectedPet) return

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await axios.delete("/api/remove/pet", {
        data: { _id: (selectedPet as any)._id },
      })
      setSuccess(true)
      setSelectedPet(null)
      setShowConfirm(false)
      setPets(pets.filter((pet) => pet !== selectedPet))
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete pet")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Remove Pet</h1>
          <p className="text-gray-600">Search for a pet and remove them from the system</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Pet removed successfully!</span>
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
                  onKeyPress={(e) => e.key === "Enter" && searchPets()}
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
                      selectedPet === pet ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{pet.name}</h3>
                        <p className="text-sm text-gray-600">
                          {pet.species} • {pet.breed}
                        </p>
                        {pet.age_years && <p className="text-sm text-gray-500">{pet.age_years} years old</p>}
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

          {/* Delete Confirmation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Remove Pet</h2>

            {selectedPet ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Selected Pet</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Name:</strong> {selectedPet.name}
                    </p>
                    <p>
                      <strong>Species:</strong> {selectedPet.species}
                    </p>
                    {selectedPet.breed && (
                      <p>
                        <strong>Breed:</strong> {selectedPet.breed}
                      </p>
                    )}
                    {selectedPet.age_years && (
                      <p>
                        <strong>Age:</strong> {selectedPet.age_years} years
                      </p>
                    )}
                    {selectedPet.color && (
                      <p>
                        <strong>Color:</strong> {selectedPet.color}
                      </p>
                    )}
                    {selectedPet.gender && (
                      <p>
                        <strong>Gender:</strong> {selectedPet.gender}
                      </p>
                    )}
                    <p>
                      <strong>Status:</strong> {selectedPet.adoption.status ? "Adopted" : "Available"}
                    </p>
                    {selectedPet.adoption.adopter_email && (
                      <p>
                        <strong>Adopter:</strong> {selectedPet.adoption.adopter_email}
                      </p>
                    )}
                  </div>
                </div>

                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Pet
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800">Confirm Deletion</h4>
                          <p className="text-sm text-red-700 mt-1">
                            Are you sure you want to remove <strong>{selectedPet.name}</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {loading ? "Removing..." : "Confirm Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trash2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Search and select a pet to remove</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
