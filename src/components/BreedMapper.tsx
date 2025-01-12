import { BreedCard } from './BreedCard.tsx';
import { BreedsData} from '../types/breedsData.ts'

interface BreedMapperProps {
    breeds: BreedsData;
}

export const BreedMapper: React.FC<BreedMapperProps> = ({ breeds }) => {
    return (
        <div className="space-y-4">
            {breeds.data.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
            ))}
        </div>
    );
};