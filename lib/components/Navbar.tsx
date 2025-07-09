'use client'

import Link from "next/link"
import { Home, Search, Plus, Edit, Trash2, BarChart3, Users, Cat, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Cat className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-900">Stray Ta Base</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors">
                <Cat className="h-4 w-4" />
                <span>Pets</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    href="/pets/search"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Pets
                  </Link>
                  <Link
                    href="/pets/add"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pet
                  </Link>
                  <Link
                    href="/pets/edit"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Pet
                  </Link>
                  <Link
                    href="/pets/delete"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Pet
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors">
                <Users className="h-4 w-4" />
                <span>Adopters</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    href="/adopters/search"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Adopters
                  </Link>
                  <Link
                    href="/adopters/add"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Adopter
                  </Link>
                  <Link
                    href="/adopters/edit"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Adopter
                  </Link>
                  <Link
                    href="/adopters/delete"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Adopter
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/analytics"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <p className="pl-.5">Log Out</p>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
