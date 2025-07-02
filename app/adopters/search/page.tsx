"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "@/lib/components/Navbar"
import { Search, Filter, Users, Mail, MapPin, Heart } from "lucide-react"
import axios from "axios"
import type { Adopter } from "@/lib/schemas/adopter"

const getAdopterData = async (name: string, city: string, age: string, previousPets: string): Promise<Adopter[]> => {
  try {
    const { data } = await axios.get<Adopter[]>("/api/get/adopter", {
      params: {
        name: name || undefined,
        city: city || undefined,
        age: age || undefined,
        previous_pets: previousPets || undefined,
      },
    })
    return data
  } catch (error) {
    console.error("Error fetching adopter data:", error)
    return []
  }
}

export default function SearchAdopters() {
  const [adopters, setAdopters] = useState<Adopter[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [age, setAge] = useState<string>("")
  const [previousPets, setPreviousPets] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  const searchAdopters = async () => {
    setLoading(true)
    const data = await getAdopterData(name, city, age, previousPets)
    setAdopters(data)
    setLoading(false)
  }

  useEffect(() => {
    searchAdopters()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchAdopters()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Adopters</h1>
          <p className="text-gray-600">Find and manage adopter information</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adopter Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter age..."
                      min="18"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Pets</label>
                    <input
                      type="number"
                      value={previousPets}
                      onChange={(e) => setPreviousPets(e.target.value)}
                      placeholder="Number of previous pets..."
                      min="0"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {adopters ? `${adopters.length} adopters found` : "Loading..."}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for adopters...</p>
          </div>
        ) : adopters && adopters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adopters.map((adopter, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{adopter.name}</h3>
                      <p className="text-blue-600 font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {adopter.adopter_email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {adopter.age && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Age: {adopter.age} years</span>
                      </div>
                    )}
                    {adopter.city && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>City: {adopter.city}</span>
                      </div>
                    )}
                    {adopter.previous_pets !== undefined && (
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Previous pets: {adopter.previous_pets}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : adopters ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No adopters found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}
