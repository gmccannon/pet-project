"use client"
import type React from "react"
import { useState } from "react"
import Navbar from "@/lib/components/Navbar"
import { Plus, Check, X } from "lucide-react"
import axios from "axios"

export default function AddPet() {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age_years: "",
    gender: "",
    color: "",
    arrival_date: "",
    adoption: {
      status: false,
      date: null,
      adopter_email: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const submitData = {
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

      await axios.post("/api/add/pet", submitData)
      setSuccess(true)
      setFormData({
        name: "",
        species: "",
        breed: "",
        age_years: "",
        gender: "",
        color: "",
        arrival_date: "",
        adoption: {
          status: false,
          date: null,
          adopter_email: "",
        },
      })
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add pet")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name.startsWith("adoption.")) {
      const adoptionField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        adoption: {
          ...prev.adoption,
          [adoptionField]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Pet</h1>
          <p className="text-gray-600">Register a new pet in the adoption system</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">Pet added successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <X className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pet name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
              <select
                name="species"
                value={formData.species}
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
                value={formData.breed}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter breed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
              <input
                type="number"
                name="age_years"
                value={formData.age_years}
                onChange={handleInputChange}
                min="0"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
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
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter color"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Date</label>
              <input
                type="date"
                name="arrival_date"
                value={formData.arrival_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Adoption Information */}
            <div className="md:col-span-2 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Adoption Status</h2>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="adoption.status"
                  checked={formData.adoption.status}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">This pet has been adopted</span>
              </label>
            </div>

            {formData.adoption.status && (
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
                    value={formData.adoption.adopter_email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter adopter email"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loading ? "Adding..." : "Add Pet"}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
