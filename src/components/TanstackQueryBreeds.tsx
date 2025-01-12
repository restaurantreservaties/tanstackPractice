import {queryKey, url} from '../constants/Constants.ts'
import {useQuery} from '@tanstack/react-query'
import {BreedMapper} from './BreedMapper.tsx'
import {BreedsData} from '../types/breedsData.ts'
import { clear, create, database } from '../fakeDatabase/databaseFaker.ts'

export const TanstackQueryBreeds=() => {
    const queryFn = async (): Promise<BreedsData> => {
        const response = await fetch(`${url}`)
        if (!response.ok) throw new Error('Network response was not ok');

        const breeds: BreedsData = await response.json();

        if (breeds) {
            await clear();
            const existingIds = database.map((breed) => breed.id);
            breeds.data.forEach(async (breed) => {
                if (!existingIds.includes(breed.id)) {
                    await create(breed);
                }
            });
        }
        
        return breeds;
    };

    const {data: breeds, isLoading, error} = useQuery<BreedsData>({
        queryKey: queryKey,
        queryFn: queryFn,
        refetchInterval: 60 * 60 * 1000, // refetch every hour
    });

    if (isLoading)
        return <div>Loading...</div>

    if (error)
        return <div>Error: {error.message}</div>

    if (!breeds)
        return <div>No breeds found</div>

    return <BreedMapper breeds={breeds} />
}