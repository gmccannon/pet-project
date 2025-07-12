"use client"
import { useState, useEffect } from "react"
import Navbar from "@/lib/components/Navbar"
import { Heart, Users, Cat, Star, MapPin, Filter } from "lucide-react"
import axios from "axios"
import type { Pet } from "@/lib/schemas/pet"
import type { Adopter } from "@/lib/schemas/adopter"

interface MatchResult {
  pet: Pet & { _id: string }
  adopter: Adopter & { _id: string }
  matchScore: number
  matchFactors: {
    speciesPreference: number
    experienceLevel: number
    locationCompatibility: number
    ageCompatibility: number
    sizeCompatibility: number
  }
  reasons: string[]
  compatibility: "excellent" | "good" | "fair"
}

interface MatchingFilters {
  minMatchScore: number
  compatibility: string
  species: string
  city: string
}

export default function PetMatching() {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<MatchingFilters>({
    minMatchScore: 0.6,
    compatibility: "",
    species: "",
    city: "",
  })

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const response = await axios.get<MatchResult[]>("/api/matching/pet-adopter", {
        params: filters,
      })
      setMatches(response.data)
    } catch (err) {
      setError("Failed to fetch pet matches")
    } finally {
      setLoading(false)
    }
  }

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case "excellent":
        return "text-green-600 bg-green-100"
      case "good":
        return "text-blue-600 bg-blue-100"
      case "fair":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-blue-600"
    if (score >= 0.4) return "text-yellow-600"
    return "text-red-600"
  }

  const handleFilterChange = (key: keyof MatchingFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    fetchMatches()
    setShowFilters(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Heart className="h-8 w-8 text-rose-600 mr-3" />
            Smart Pet Matching
          </h1>
          <p className="text-gray-600">AI-powered matching system to find perfect pet-adopter pairs</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Matching Filters</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Match Score: {(filters.minMatchScore * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.minMatchScore}
                  onChange={(e) => handleFilterChange("minMatchScore", Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compatibility</label>
                <select
                  value={filters.compatibility}
                  onChange={(e) => handleFilterChange("compatibility", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Levels</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                <select
                  value={filters.species}
                  onChange={(e) => handleFilterChange("species", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Hamster">Hamster</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={applyFilters}
                  className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="h-8 w-8 text-rose-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Total Matches</h3>
            <p className="text-2xl font-bold text-rose-600">{matches.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Excellent Matches</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {matches.filter((m) => m.compatibility === "excellent").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Avg Match Score</h3>
            <p className="text-2xl font-bold text-blue-600">
              {matches.length > 0
                ? ((matches.reduce((acc, m) => acc + m.matchScore, 0) / matches.length) * 100).toFixed(1)
                : 0}
              %
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matches List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pet-Adopter Matches</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {matches.map((match, index) => (
                <div
                  key={`${match.pet._id}-${match.adopter._id}`}
                  onClick={() => setSelectedMatch(match)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMatch === match ? "border-rose-500 bg-rose-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Cat className="h-4 w-4 text-gray-500 mr-2" />
                        <h3 className="font-medium text-gray-900">{match.pet.name}</h3>
                        <span className="mx-2 text-gray-400">→</span>
                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">{match.adopter.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {match.pet.species} • {match.pet.breed} → {match.adopter.adopter_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(match.matchScore)}`}>
                        {(match.matchScore * 100).toFixed(1)}%
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(match.compatibility)}`}
                      >
                        {match.compatibility}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {match.adopter.city || "Location not specified"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-6">
            {selectedMatch ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Match Details</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Cat className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                        <p className="font-medium text-gray-900">{selectedMatch.pet.name}</p>
                        <p className="text-sm text-gray-600">{selectedMatch.pet.species}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                        <p className="font-medium text-gray-900">{selectedMatch.adopter.name}</p>
                        <p className="text-sm text-gray-600">{selectedMatch.adopter.previous_pets || 0} prev pets</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Match Factors</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedMatch.matchFactors).map(([factor, score]) => (
                          <div key={factor} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">
                              {factor.replace(/([A-Z])/g, " $1")}
                            </span>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                                <div
                                  className="bg-rose-600 h-1.5 rounded-full"
                                  style={{ width: `${score * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-900 w-8">{(score * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-medium text-gray-900 mb-3">Why This Match Works</h3>
                  <div className="space-y-2">
                    {selectedMatch.reasons.map((reason, index) => (
                      <div key={index} className="flex items-start">
                        <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a match to see detailed analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Smart Matching Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">15+</p>
              <p className="text-rose-100">Matching Criteria</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">92%</p>
              <p className="text-rose-100">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-rose-100">Successful Matches</p>
            </div>
          </div>
          <p className="text-rose-100 mt-4 text-center">
            Our intelligent matching system analyzes pet characteristics, adopter preferences, experience levels, and
            compatibility factors to create perfect matches.
          </p>
        </div>
      </main>
    </div>
  )
}
