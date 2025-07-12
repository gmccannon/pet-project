"use client"
import { useState, useEffect } from "react"
import Navbar from "@/lib/components/Navbar"
import { Sparkle, TrendingUp, AlertCircle, CheckCircle, Clock, Zap, Target, BarChart3, Check } from "lucide-react"
import axios from "axios"

interface PredictionResult {
  petId: string
  petName: string
  species: string
  age: number
  breed: string
  adoptionProbability: number
  riskLevel: "low" | "medium" | "high"
  factors: {
    age: number
    species: number
    breed: number
    timeInShelter: number
    color: number
  }
  recommendations: string[]
  daysInShelter: number
}

interface MLInsights {
  totalPredictions: number
  averageAdoptionProbability: number
  highRiskPets: number
  lowRiskPets: number
  topFactors: { factor: string; impact: number }[]
  predictions: PredictionResult[]
}

export default function MLInsights() {
  const [insights, setInsights] = useState<MLInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedPet, setSelectedPet] = useState<PredictionResult | null>(null)

  useEffect(() => {
    fetchMLInsights()
  }, [])

  const fetchMLInsights = async () => {
    setLoading(true)
    try {
      const response = await axios.get<MLInsights>("/api/ml/adoption-predictions")
      setInsights(response.data)
    } catch (err) {
      setError("Failed to fetch ML insights")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return "text-green-600"
    if (probability >= 0.4) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error || "Failed to load ML insights"}</p>
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
            <Sparkle className="h-8 w-8 text-purple-600 mr-3" />
            Adoption Chance Insights
          </h1>
          <p className="text-gray-600">Insights for pet adoption likelihood</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{insights.totalPredictions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Adoption Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(insights.averageAdoptionProbability * 100).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Pets</p>
                <p className="text-2xl font-bold text-gray-900">{insights.highRiskPets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Low Risk Pets</p>
                <p className="text-2xl font-bold text-gray-900">{insights.lowRiskPets}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Predictions List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Adoption Predictions</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {insights.predictions.map((prediction) => (
                <div
                  key={prediction.petId}
                  onClick={() => setSelectedPet(prediction)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPet?.petId === prediction.petId
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{prediction.petName}</h3>
                      <p className="text-sm text-gray-600">
                        {prediction.species} • {prediction.breed} • {prediction.age} years old
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getProbabilityColor(prediction.adoptionProbability)}`}>
                        {(prediction.adoptionProbability * 100).toFixed(0)}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(prediction.riskLevel)}`}
                      >
                        {prediction.riskLevel} risk
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {prediction.daysInShelter} days in shelter
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="space-y-6">
            {/* Top Factors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Key Factors
              </h2>
              <div className="space-y-3">
                {insights.topFactors.map((factor, index) => (
                  <div key={factor.factor} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{factor.factor}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${factor.impact * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {(factor.impact * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Pet Details */}
            {selectedPet && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{selectedPet.petName} - Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Factor Scores</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedPet.factors).map(([factor, score]) => (
                        <div key={factor} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{factor.replace(/([A-Z])/g, " $1")}</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${Math.abs(score) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 w-8">
                              {score > 0 ? "+" : ""}
                              {(score * 100).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
