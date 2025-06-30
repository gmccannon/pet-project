'use client'
import React from 'react'
import { Pet } from '@/lib/schemas/pet';
import Dropdown from '@/lib/components/Dropdown';

type Species = 'Dog' | 'Cat' | 'Bird' | 'Hamster' | 'Rabbit' | '';

const getPetData = async (name: string, species: string): Promise<Pet[]> => {
  try {
    const res = await fetch(`/api/get/pet?name=${name}&species=${species}`, {
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
  const [pets, setPets] = React.useState<Pet[] | null>(null);
  const [name, setName] = React.useState("");
  const [species, setSpecies] = React.useState<Species>("");

  React.useEffect(() => {
    if (name != undefined) {
      getPetData(name, species).then((data) => setPets(data));
    } else {
      setPets(null);
    }
  }, [name, species]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Search for a Pet</h1>

      <input
        type="text"
        value={name}
        placeholder="Type in name..."
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Dropdown 
        options={['Dog', 'Cat', 'Bird', 'Hamster', 'Rabbit']}
        value ={species || ''}
        onChange={(value) => setSpecies(value as Species)}
        label="Select Species"
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
                {pet.color && <p className="text-gray-700">Color: {pet.color}</p>}
                {pet.gender && <p className="text-gray-700">Gender: {pet.gender}</p>}
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
