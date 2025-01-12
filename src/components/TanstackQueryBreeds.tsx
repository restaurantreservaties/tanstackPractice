import {queryKey, url} from '../constants/Constants.ts'
import {useQuery} from '@tanstack/react-query'
import {BreedMapper} from './BreedMapper.tsx'
import {BreedsData} from '../types/breedsData.ts'

export const TanstackQueryBreeds=() => {
    const {data: breeds, isLoading, error} = useQuery<BreedsData>({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await fetch(`${url}`)
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json()
        },
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