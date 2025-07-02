"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "@/lib/components/Navbar"
import type { Pet } from "@/lib/schemas/pet"
import { Search, Filter, Cat, Calendar, MapPin } from "lucide-react"
import axios from "axios"
import Slider from '@mui/material/Slider';

type Species = "Dog" | "Cat" | "Bird" | "Hamster" | "Rabbit" | ""

const getPetData = async (name: string, species: string, min: number, max: number): Promise<Pet[]> => {
  try {
    const { data } = await axios.get<Pet[]>("/api/get/pet", {
      params: {
        name: name || undefined,
        species: species || undefined,
        min: min || undefined,
        max: max || undefined,
      },
    })
    return data
  } catch (error) {
    console.error("Error fetching pet data:", error)
    return []
  }
}

export default function SearchPets() {
  const [pets, setPets] = useState<Pet[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState<string>("")
  const [species, setSpecies] = useState<Species>("")
  const [ageRange, setAgeRange] = useState<[number, number]>([1, 20])
  const [showFilters, setShowFilters] = useState(false)

  const searchPets = async () => {
    setLoading(true)
    const data = await getPetData(name, species, ageRange[0], ageRange[1])
    setPets(data)
    setLoading(false)
  }

  useEffect(() => {
    searchPets()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchPets()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Pets</h1>
          <p className="text-gray-600">Find the perfect companion for adoption</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as Species)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Rabbit">Rabbit</option>
                </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range: {ageRange[0]} - {ageRange[1]} years
                    </label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={ageRange}
                        onChange={(e, v) => { setAgeRange(v as [number, number]) }}
                        valueLabelDisplay="auto"
                        min={1}
                        max={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{pets ? `${pets.length} pets found` : "Loading..."}</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching for pets...</p>
          </div>
        ) : pets && pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                      <p className="text-blue-500 font-medium">{pet.species}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pet.adoption.status ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {pet.adoption.status ? "Adopted" : "Available"}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {pet.breed && (
                      <div className="flex items-center">
                        <Cat className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Breed: {pet.breed}</span>
                      </div>
                    )}
                    {pet.age_years !== undefined && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Age: {pet.age_years} years</span>
                      </div>
                    )}
                    {pet.color && (
                      <div className="flex items-center">
                        <div className="h-4 w-4 mr-2 rounded-full bg-gray-300"></div>
                        <span>Color: {pet.color}</span>
                      </div>
                    )}
                    {pet.gender && (
                      <div className="flex items-center">
                        <span className="h-4 w-4 mr-2 text-gray-400">♂♀</span>
                        <span>Gender: {pet.gender}</span>
                      </div>
                    )}
                    {pet.arrival_date && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Arrived: {new Date(pet.arrival_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {pet.adoption.status && pet.adoption.date && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Adopted:</strong> {new Date(pet.adoption.date).toLocaleDateString()}
                      </p>
                      {pet.adoption.adopter_email && (
                        <p className="text-sm text-green-700">Adopter: {pet.adoption.adopter_email}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : pets ? (
          <div className="text-center py-12">
            <Cat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : null}
      </main>
    </div>
  )
}
