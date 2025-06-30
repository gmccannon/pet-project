'use client'
import React from 'react'
import { Pet } from '@/app/api/add/pet/route'

const getPetData = async (search: string): Promise<Pet[]> => {
  try {
    const res = await fetch(`/api/get/pet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json() as Pet[];
    return data;
  } catch (error) {
    console.error('Error fetching pet data:', error);
    return [];
  }
}

const Page = () => {
  const [search, setSearch] = React.useState("");
  const [pets, setPets] = React.useState<Pet[] | null>(null);

  React.useEffect(() => {
    if (search != undefined) {
      getPetData(search).then((data) => setPets(data));
    } else {
      setPets(null);
    }
  }, [search]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Search for a Pet</h1>

      <input
        type="text"
        value={search}
        placeholder="Type to search..."
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div>
        {pets && pets.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pets.map((pet, ind) => (
              <li key={ind} className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition">
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <p className="text-gray-700">Species: {pet.species}</p>
                {pet.breed && <p className="text-gray-700">Breed: {pet.breed}</p>}
                {pet.age_years !== undefined && <p className="text-gray-700">Age: {pet.age_years} years</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No pets found</p>
        )}
      </div>
    </main>
  )
}

export default Page;
