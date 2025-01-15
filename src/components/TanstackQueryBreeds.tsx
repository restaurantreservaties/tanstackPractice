import { queryKey, url } from '../constants/Constants';
import { useQuery } from '@tanstack/react-query';
import { BreedMapper } from './BreedMapper';
import { Breed, BreedsData } from '../types/breedsData';
import { create, database } from '../fakeDatabase/databaseFaker';

export const TanstackQueryBreeds = () => {
    const queryFn = async (): Promise<Breed[]> => {
        if (database.length !== 0) {
            return database;
        }
        else {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const breedsData: BreedsData = await response.json();

            if (breedsData) {
                const existingNames = new Set(database.map((breed) => breed.attributes.name));
                for (const breed of breedsData.data) {
                    if (!existingNames.has(breed.attributes.name)) {
                        await create(breed);
                    }
                }
            }

            return breedsData.data;
        }
    };

    const { data: breeds, isLoading, error } = useQuery<Breed[]>({
        queryKey: queryKey,
        queryFn: queryFn,
        refetchInterval: 60 * 60 * 1000, // Refetch elke uur
    });

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;
    if (!breeds || breeds.length === 0) return <div>No breeds found</div>;
    return <BreedMapper breeds={breeds} />;
};
