import React from 'react';
import {BreedsData} from '../types/breedsData.ts'

interface BreedCardProps {
    breed: BreedsData['data'][0];
}

export const BreedCard: React.FC<BreedCardProps> = ({ breed }) => {
    const { type, attributes } = breed;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{type}</h3>
            <p className="text-gray-600">{attributes.name}</p>
            <p className="text-gray-600">Age range: {attributes.life.min}-{attributes.life.max}</p>
            <p className="text-gray-600">Male weight: {attributes.male_weight.min}-{attributes.male_weight.max}</p>
            <p className="text-gray-600">Female weight: {attributes.female_weight.min}-{attributes.female_weight.max}</p>
            <p className="text-gray-600">Description: {attributes.description}</p>
            <p className="text-gray-600">Hypoallergenic: {attributes.hypoallergenic ? 'Yes' : 'No'}</p>
        </div>
    );
};