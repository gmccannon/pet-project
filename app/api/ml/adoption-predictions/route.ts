import { NextResponse } from "next/server"
import mongoose from "mongoose"

const petSchema = new mongoose.Schema({}, { strict: false })
const Pet = mongoose.models.Pet || mongoose.model("Pet", petSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "your-db-name",
    })
  }
}

// Simple ML prediction algorithm
function calculateAdoptionProbability(pet: any): {
  probability: number
  factors: any
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
} {
  let score = 0.5 // Base score
  const factors = {
    age: 0,
    species: 0,
    breed: 0,
    timeInShelter: 0,
    color: 0,
  }

  // Age factor (younger pets have higher adoption rates)
  if (pet.age_years <= 2) {
    factors.age = 0.3
    score += 0.3
  } else if (pet.age_years <= 5) {
    factors.age = 0.1
    score += 0.1
  } else if (pet.age_years <= 10) {
    factors.age = -0.1
    score -= 0.1
  } else {
    factors.age = -0.3
    score -= 0.3
  }

  // Species factor
  const speciesScores: { [key: string]: number } = {
    Dog: 0.2,
    Cat: 0.15,
    Rabbit: 0.05,
    Bird: -0.05,
    Hamster: -0.1,
  }
  factors.species = speciesScores[pet.species] || 0
  score += factors.species

  // Popular breeds get bonus
  const popularBreeds = ["Labrador Retriever", "Golden Retriever", "German Shepherd", "Maine Coon", "Persian"]
  if (popularBreeds.includes(pet.breed)) {
    factors.breed = 0.15
    score += 0.15
  } else {
    factors.breed = -0.05
    score -= 0.05
  }

  // Time in shelter (longer = lower probability)
  const daysInShelter = pet.arrival_date
    ? Math.floor((Date.now() - new Date(pet.arrival_date).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  if (daysInShelter > 365) {
    factors.timeInShelter = -0.4
    score -= 0.4
  } else if (daysInShelter > 180) {
    factors.timeInShelter = -0.2
    score -= 0.2
  } else if (daysInShelter > 90) {
    factors.timeInShelter = -0.1
    score -= 0.1
  } else {
    factors.timeInShelter = 0.1
    score += 0.1
  }

  // Color factor (some colors are more popular)
  const popularColors = ["Golden", "Brown", "Black"]
  if (popularColors.includes(pet.color)) {
    factors.color = 0.05
    score += 0.05
  } else {
    factors.color = -0.02
    score -= 0.02
  }

  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score))

  // Generate recommendations
  const recommendations: string[] = []
  if (pet.age_years > 7) {
    recommendations.push("Highlight senior pet benefits and lower adoption fees")
  }
  if (daysInShelter > 180) {
    recommendations.push("Feature in social media campaigns and special events")
  }
  if (!popularBreeds.includes(pet.breed)) {
    recommendations.push("Emphasize unique personality traits and temperament")
  }
  if (pet.species === "Bird" || pet.species === "Hamster") {
    recommendations.push("Target specialized pet communities and forums")
  }
  if (score < 0.4) {
    recommendations.push("Consider temporary foster programs to increase visibility")
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high"
  if (score >= 0.7) riskLevel = "low"
  else if (score >= 0.4) riskLevel = "medium"
  else riskLevel = "high"

  return { probability: score, factors, recommendations, riskLevel }
}

export async function GET() {
  try {
    await connectDB()

    // Get all available pets (not adopted)
    const availablePets = await Pet.find({ "adoption.status": false })

    const predictions = availablePets.map((pet: any) => {
      const prediction = calculateAdoptionProbability(pet)
      const daysInShelter = pet.arrival_date
        ? Math.floor((Date.now() - new Date(pet.arrival_date).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      return {
        petId: pet._id.toString(),
        petName: pet.name,
        species: pet.species,
        age: pet.age_years,
        breed: pet.breed || "Mixed",
        adoptionProbability: prediction.probability,
        riskLevel: prediction.riskLevel,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
        daysInShelter,
      }
    })

    // Sort by adoption probability (lowest first to highlight at-risk pets)
    predictions.sort((a, b) => a.adoptionProbability - b.adoptionProbability)

    const insights = {
      totalPredictions: predictions.length,
      averageAdoptionProbability: predictions.reduce((acc, p) => acc + p.adoptionProbability, 0) / predictions.length,
      highRiskPets: predictions.filter((p) => p.riskLevel === "high").length,
      lowRiskPets: predictions.filter((p) => p.riskLevel === "low").length,
      topFactors: [
        { factor: "age", impact: 0.3 },
        { factor: "time in shelter", impact: 0.25 },
        { factor: "species", impact: 0.2 },
        { factor: "breed popularity", impact: 0.15 },
        { factor: "color", impact: 0.1 },
      ],
      predictions,
    }

    return NextResponse.json(insights)
  } catch (error: any) {
    console.error("ML prediction error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
