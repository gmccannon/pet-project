import Navbar from "@/lib/components/Navbar"
import Link from "next/link"
import { Cat, Users, BarChart3, Search, Plus, Edit, Trash2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Cat className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Stray Ta Base</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive pet adoption management system to help connect loving pets with caring families.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Cat className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Pets Available</h3>
            <p className="text-gray-600">Find your perfect companion</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Adopters</h3>
            <p className="text-gray-600">Manage adoption applications</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            <p className="text-gray-600">Track adoption trends</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Management */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Cat className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Pet Management</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/pets/search"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Search className="h-5 w-5 text-blue-500 mr-3" />
                <span className="font-medium text-gray-900">Search Pets</span>
              </Link>
              <Link
                href="/pets/add"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Plus className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Add Pet</span>
              </Link>
              <Link
                href="/pets/edit"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Edit Pet</span>
              </Link>
              <Link
                href="/pets/delete"
                className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600 mr-3" />
                <span className="font-medium text-gray-900">Remove Pet</span>
              </Link>
            </div>
          </div>

          {/* Adopter Management */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Adopter Management</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/adopters/search"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Search className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Search Adopters</span>
              </Link>
              <Link
                href="/adopters/add"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Plus className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Add Adopter</span>
              </Link>
              <Link
                href="/adopters/edit"
                className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <Edit className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">Edit Adopter</span>
              </Link>
              <Link
                href="/adopters/delete"
                className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600 mr-3" />
                <span className="font-medium text-gray-900">Remove Adopter</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8">
          <Link
            href="/analytics"
            className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg p-8 hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <div className="flex items-center justify-center">
              <BarChart3 className="h-8 w-8 mr-3" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">View Analytics Dashboard</h2>
                <p className="text-purple-100">Get insights into adoption trends, pet statistics, and more</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
