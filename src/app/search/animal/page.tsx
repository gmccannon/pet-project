'use client'
import React from 'react'
import { Pet } from '@/lib/schemas/pet';
import Dropdown from '@/lib/components/Dropdown';
import Slider from '@mui/material/Slider';
import axios from 'axios';

type Species = 'Dog' | 'Cat' | 'Bird' | 'Hamster' | 'Rabbit' | '';

const getPetData = async (name: string, species: string, age: number[]): Promise<Pet[]> => {
  try {
    const { data } = await axios.get<Pet[]>('/api/get/pet', {
      params: {
        name,
        species,
        min: age[0],
        max: age[1],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching pet data:', error);
    return [];
  }
}

const Page = () => {
  const [pets, setPets] = React.useState<Pet[] | null>(null);
  const [name, setName] = React.useState<string>('');
  const [species, setSpecies] = React.useState<Species>('');
  const [age, setAge] = React.useState<number[]>([1, 20]);

  React.useEffect(() => {
    getPetData(name, species, age).then((data) => setPets(data));
  }, [name, species, age]);

  return (
    <main className='max-w-6xl mx-auto p-6 grid'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Search for a Pet</h1>
      <input
        type='text'
        value={name}
        placeholder='Type in a name...'
        onChange={(e) => setName(e.target.value)}
        className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      <Dropdown 
        options={['Dog', 'Cat', 'Bird', 'Hamster', 'Rabbit']}
        value ={species}
        onChange={(value) => setSpecies(value as Species)}
        label='Select Species'
      />
      <Slider
        value={age}
        onChange={(e, v) => {setAge(v)}}
        valueLabelDisplay="auto"
        min={1}
        max={20}
      />
      <div>
        {pets && pets.length > 0 ? (
          <ul className='grid grid-cols-4 md:grid-cols-2 gap-6'>
            {pets.map((pet, ind) => (
              <li key={ind} className='border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition'>
                <h3 className='text-xl font-semibold'>{pet.name}</h3>
                <p className='text-gray-700'>Species: {pet.species}</p>
                {pet.breed && <p className='text-gray-700'>Breed: {pet.breed}</p>}
                {pet.age_years !== undefined && <p className='text-gray-700'>Age: {pet.age_years} years</p>}
                {pet.color && <p className='text-gray-700'>Color: {pet.color}</p>}
                {pet.gender && <p className='text-gray-700'>Gender: {pet.gender}</p>}
                {pet.adoption.status && <p className='font-extrabold text-green-700'>Adopted</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-gray-500'>No pets found</p>
        )}
      </div>
    </main>
  )
}

export default Page;
