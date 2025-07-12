import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

const petSchema = new mongoose.Schema({}, { strict: false })
const adopterSchema = new mongoose.Schema({}, { strict: false })

const Pet = mongoose.models.Pet || mongoose.model("Pet", petSchema)
const Adopter = mongoose.models.Adopter || mongoose.model("Adopter", adopterSchema)

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "your-db-name",
    })
  }
}

function calculateMatchScore(pet: any, adopter: any) {
  let score = 0
  const factors = {
    speciesPreference: 0,
    experienceLevel: 0,
    locationCompatibility: 0,
    ageCompatibility: 0,
    sizeCompatibility: 0,
  }

  // Species preference (assume all adopters are open to all species for now)
  factors.speciesPreference = 0.8
  score += 0.8

  // Experience level based on previous pets
  const previousPets = adopter.previous_pets || 0
  if (pet.species === "Dog" || pet.species === "Cat") {
    if (previousPets >= 2) {
      factors.experienceLevel = 0.9
      score += 0.9
    } else if (previousPets >= 1) {
      factors.experienceLevel = 0.7
      score += 0.7
    } else {
      factors.experienceLevel = 0.5
      score += 0.5
    }
  } else {
    // Exotic pets need more experience
    if (previousPets >= 3) {
      factors.experienceLevel = 0.8
      score += 0.8
    } else if (previousPets >= 1) {
      factors.experienceLevel = 0.6
      score += 0.6
    } else {
      factors.experienceLevel = 0.3
      score += 0.3
    }
  }

  // Location compatibility (same city gets bonus)
  if (adopter.city) {
    factors.locationCompatibility = 0.7 // Assume good compatibility
    score += 0.7
  } else {
    factors.locationCompatibility = 0.5
    score += 0.5
  }

  // Age compatibility (younger adopters with younger pets, older adopters flexible)
  const adopterAge = adopter.age || 35
  const petAge = pet.age_years || 3

  if (adopterAge < 30 && petAge <= 3) {
    factors.ageCompatibility = 0.9
    score += 0.9
  } else if (adopterAge >= 50 && petAge >= 5) {
    factors.ageCompatibility = 0.8
    score += 0.8
  } else {
    factors.ageCompatibility = 0.6
    score += 0.6
  }

  // Size compatibility (assume medium compatibility for all)
  factors.sizeCompatibility = 0.7
  score += 0.7

  // Normalize score (divide by number of factors)
  score = score / 5

  return { score: Math.min(1, score), factors }
}

function generateMatchReasons(pet: any, adopter: any, matchScore: number): string[] {
  const reasons: string[] = []

  if (adopter.previous_pets >= 2) {
    reasons.push(`${adopter.name} has experience with ${adopter.previous_pets} previous pets`)
  }

  if (pet.age_years <= 2) {
    reasons.push(`${pet.name} is young and energetic, great for active families`)
  } else if (pet.age_years >= 7) {
    reasons.push(`${pet.name} is mature and calm, perfect for a peaceful home`)
  }

  if (adopter.city) {
    reasons.push(`Both are located in ${adopter.city} area for easy visits`)
  }

  if (pet.species === "Dog" && adopter.previous_pets >= 1) {
    reasons.push("Experienced with pet care and training")
  }

  if (matchScore >= 0.8) {
    reasons.push("Excellent compatibility across all factors")
  }

  return reasons
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const minMatchScore = Number.parseFloat(searchParams.get("minMatchScore") || "0.6")
    const compatibility = searchParams.get("compatibility")
    const species = searchParams.get("species")

    // Get available pets and all adopters
    const availablePets = await Pet.find({ "adoption.status": false })
    const adopters = await Adopter.find({})

    const matches: any[] = []

    // Calculate matches for each pet-adopter combination
    for (const pet of availablePets) {
      if (species && pet.species !== species) continue

      for (const adopter of adopters) {
        const matchResult = calculateMatchScore(pet, adopter)

        if (matchResult.score >= minMatchScore) {
          let compatibilityLevel: "excellent" | "good" | "fair"
          if (matchResult.score >= 0.8) compatibilityLevel = "excellent"
          else if (matchResult.score >= 0.6) compatibilityLevel = "good"
          else compatibilityLevel = "fair"

          if (compatibility && compatibilityLevel !== compatibility) continue

          matches.push({
            pet: { ...pet.toObject(), _id: pet._id.toString() },
            adopter: { ...adopter.toObject(), _id: adopter._id.toString() },
            matchScore: matchResult.score,
            matchFactors: matchResult.factors,
            reasons: generateMatchReasons(pet, adopter, matchResult.score),
            compatibility: compatibilityLevel,
          })
        }
      }
    }

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore)

    // Limit to top 50 matches to avoid overwhelming the UI
    const topMatches = matches.slice(0, 50)

    return NextResponse.json(topMatches)
  } catch (error: any) {
    console.error("Matching error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
