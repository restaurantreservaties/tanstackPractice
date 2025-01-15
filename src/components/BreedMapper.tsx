import { BreedCard } from './BreedCard.tsx';
import { Breed} from '../types/breedsData.ts'
import NewRecord from './newRecord.tsx';

interface BreedMapperProps {
    breeds: Breed[];
}

export const BreedMapper: React.FC<BreedMapperProps> = ({ breeds }) => {
    return (
        <> 
        <div className="space-y-4">
            <NewRecord />
        </div>
        <div className="space-y-4">
            {breeds.map((breed) => (
                <BreedCard key={breed.id} breed={breed} />
            ))}
        </div>
        </>
       
    );
};