"use client"
import { useState, useEffect } from "react"
import Navbar from "@/lib/components/Navbar"
import { BarChart3, PieChart, TrendingUp, Users, Cat, Calendar, MapPin, PaintBucket } from "lucide-react"
import axios from "axios"
import type { Pet } from "@/lib/schemas/pet"
import type { Adopter } from "@/lib/schemas/adopter"

interface AnalyticsData {
  totalPets: number
  totalAdopters: number
  adoptedPets: number
  availablePets: number
  adoptionRate: number
  speciesBreakdown: { [key: string]: number }
  ageDistribution: { [key: string]: number }
  monthlyAdoptions: { [key: string]: number }
  topCities: { [key: string]: number }
  breedPopularity: { [key: string]: number }
  genderBreakdown: { [key: string]: number }    
  adoptedGenderBreakdown: { [key: string]: number }  
  colorAdoptionTrends: { [key: string]: number }  
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const [petsResponse, adoptersResponse] = await Promise.all([
        axios.get<Pet[]>("/api/get/pet"),
        axios.get<Adopter[]>("/api/get/adopter"),
      ])

      const pets = petsResponse.data
      const adopters = adoptersResponse.data

      const analytics: AnalyticsData = {
        totalPets: pets.length,
        totalAdopters: adopters.length,
        adoptedPets: pets.filter((pet) => pet.adoption.status).length,
        availablePets: pets.filter((pet) => !pet.adoption.status).length,
        adoptionRate: pets.length > 0 ? (pets.filter((pet) => pet.adoption.status).length / pets.length) * 100 : 0,
        speciesBreakdown: {},
        ageDistribution: {},
        monthlyAdoptions: {},
        topCities: {},
        breedPopularity: {},
        genderBreakdown: {},
        adoptedGenderBreakdown: {},
        colorAdoptionTrends: {}
      }

      // Species breakdown
      pets.forEach((pet) => {
        analytics.speciesBreakdown[pet.species] = (analytics.speciesBreakdown[pet.species] || 0) + 1
      })

      // Age distribution
      pets.forEach((pet) => {
        if (pet.age_years !== undefined) {
          const ageGroup =
            pet.age_years < 2
              ? "Young (0-1)"
              : pet.age_years < 5
                ? "Adult (2-4)"
                : pet.age_years < 10
                  ? "Mature (5-9)"
                  : "Senior (10+)"
          analytics.ageDistribution[ageGroup] = (analytics.ageDistribution[ageGroup] || 0) + 1
        }
      })

      // Monthly adoptions
      pets
        .filter((pet) => pet.adoption.status && pet.adoption.date)
        .forEach((pet) => {
          const date = new Date(pet.adoption.date!)
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          analytics.monthlyAdoptions[monthYear] = (analytics.monthlyAdoptions[monthYear] || 0) + 1
        })

      // Top cities
      adopters.forEach((adopter) => {
        if (adopter.city) {
          analytics.topCities[adopter.city] = (analytics.topCities[adopter.city] || 0) + 1
        }
      })

      // Breed popularity
      pets.forEach((pet) => {
        if (pet.breed) {
          analytics.breedPopularity[pet.breed] = (analytics.breedPopularity[pet.breed] || 0) + 1
        }
      })

      // Gender breakdown
      pets
        .forEach((pet) => {
        if (pet.gender) {
          analytics.genderBreakdown[pet.gender] = (analytics.genderBreakdown[pet.gender] || 0) + 1
        }
      })

      // Gender breakdown by adopted
      pets
        .filter((pet) => pet.adoption.status && typeof pet.color === "string" && pet.color)
        .forEach((pet) => {
        if (pet.gender) {
          analytics.adoptedGenderBreakdown[pet.gender] = (analytics.adoptedGenderBreakdown[pet.gender] || 0) + 1
        }
      })

      // Color adoption trends
      pets
        .filter((pet) => pet.adoption.status && typeof pet.color === "string" && pet.color)
        .forEach((pet) => {
          analytics.colorAdoptionTrends[pet.color as string] = (analytics.colorAdoptionTrends[pet.color as string] || 0) + 1
        })


      setData(analytics)
    } catch (err) {
      setError("Failed to fetch analytics data")
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!data) return;

    const flatten = (obj: Record<string, number>, label: string) => {
      return Object.entries(obj).map(([key, value]) => ({
        Category: label,
        Key: key,
        Value: value,
      }));
    };

    const rows = [
      { Category: "Metric", Key: "Total Pets", Value: data.totalPets },
      { Category: "Metric", Key: "Total Adopters", Value: data.totalAdopters },
      { Category: "Metric", Key: "Adopted Pets", Value: data.adoptedPets },
      { Category: "Metric", Key: "Available Pets", Value: data.availablePets },
      { Category: "Metric", Key: "Adoption Rate (%)", Value: data.adoptionRate.toFixed(2) },
      ...flatten(data.speciesBreakdown, "Species Breakdown"),
      ...flatten(data.ageDistribution, "Age Distribution"),
      ...flatten(data.monthlyAdoptions, "Monthly Adoptions"),
      ...flatten(data.topCities, "Top Cities"),
      ...flatten(data.breedPopularity, "Breed Popularity"),
      ...flatten(data.genderBreakdown, "Gender Breakdown"),
      ...flatten(data.adoptedGenderBreakdown, "Adopted Gender Breakdown"),
      ...flatten(data.colorAdoptionTrends, "Color Adoption Trends"),
    ];

    const csv = [
      ["Category", "Key", "Value"],
      ...rows.map((row) => [row.Category, row.Key, row.Value]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error || "Failed to load analytics"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-end mt-6 pr-60">
        <button
          onClick={exportCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          Export Stats as CSV
        </button>
      </div>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Insights and statistics about pets and adoptions</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Cat className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pets</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalPets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Adopters</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalAdopters}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Adopted Pets</p>
                <p className="text-2xl font-bold text-gray-900">{data.adoptedPets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Adoption Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.adoptionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Species Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Species Distribution
            </h2>
            <div className="space-y-3">
              {Object.entries(data.speciesBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([species, count]) => (
                  <div key={species} className="flex items-center justify-between">
                    <span className="text-gray-700">{species}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(count / data.totalPets) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Age Distribution
            </h2>
            <div className="space-y-3">
               {[ "Senior (10+)", "Mature (5-9)",  "Adult (2-4)", "Young (0-1)"]
                .filter((label) => data.ageDistribution[label] !== undefined)
                .map((ageGroup) => {
                  const count = data.ageDistribution[ageGroup] as number
                  return (
                    <div key={ageGroup} className="flex items-center justify-between">
                      <span className="text-gray-700">{ageGroup}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / data.totalPets) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Adoptions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Monthly Adoptions
            </h2>
            <div className="space-y-3">
              {Object.entries(data.monthlyAdoptions)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-12)
                .map(([month, count]) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-gray-700">{month}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(data.monthlyAdoptions))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Top Cities (Adopters)
            </h2>
            <div className="space-y-3">
              {Object.entries(data.topCities)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 12) // Show top 8 cities
                .map(([city, count]) => (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-gray-700">{city}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(data.topCities))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Gender Distribution
          </h2>
          <h2 className="text-s font-semibold text-gray-900 mb-4 flex items-center">
            All
          </h2>
          <div className="space-y-3">
            {Object.entries(data.genderBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between">
                  <span className="text-gray-700">{gender}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ width: `${(count / data.totalPets) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
          </div>
          <h2 className="text-s font-semibold text-gray-900 mb-4 flex items-center pt-6">
            Adopted
          </h2>
          <div className="space-y-3">
            {Object.entries(data.adoptedGenderBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between">
                  <span className="text-gray-700">{gender}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ width: `${(count / data.totalPets) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

          {/* Color Adoption Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <PaintBucket className="h-5 w-5 mr-2" />
              Most Adopted Colors
            </h2>
            <div className="space-y-3">
              {Object.entries(data.colorAdoptionTrends)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([color, count]) => (
                  <div key={color} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{color}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(data.colorAdoptionTrends))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Popular Breeds */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Cat className="h-5 w-5 mr-2" />
              Most Popular Breeds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.breedPopularity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 12) // Show top 12 breeds
                .map(([breed, count]) => (
                  <div key={breed} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700 font-medium">{breed}</span>
                    <span className="text-sm font-bold text-blue-600">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{data.availablePets}</p>
              <p className="text-blue-100">Pets Available for Adoption</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{data.adoptionRate.toFixed(1)}%</p>
              <p className="text-blue-100">Overall Adoption Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{Object.keys(data.speciesBreakdown).length}</p>
              <p className="text-blue-100">Different Species</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
