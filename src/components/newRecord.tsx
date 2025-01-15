import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create, update } from '../fakeDatabase/databaseFaker';
import { Breed } from '../types/breedsData';

const NewRecord: React.FC = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Partial<Breed>>({
        id: '',
        type: 'breeds',
        attributes: {
            name: '',
            description: '',
            life: { max: 0, min: 0 },
            male_weight: { max: 0, min: 0 },
            female_weight: { max: 0, min: 0 },
            hypoallergenic: false,
        },
    });

    const createMutation = useMutation<Breed, Error, Breed>(create, {
        
        onSuccess: () => {
            queryClient.invalidateQueries('breeds');
        },
    });

    const updateMutation = useMutation<Breed | null, Error, { id: string; breed: Breed }>(
        ({ id, breed }) => update(id, breed),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('breeds');
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.id) {
            updateMutation.mutate({ id: formData.id, breed: formData as Breed });
        } else {
            createMutation.mutate(formData as Breed);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        const [mainKey, subKey] = name.split('.');

        setFormData((prev) => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [mainKey]: subKey
                    ? { ...prev.attributes[mainKey], [subKey]: type === 'checkbox' ? checked : value }
                    : type === 'checkbox'
                        ? checked
                        : value,
            },
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.attributes?.name || ''}
                onChange={handleChange}
                placeholder="Name"
            />
            <textarea
                name="description"
                value={formData.attributes?.description || ''}
                onChange={handleChange}
                placeholder="Description"
            />
            <input
                type="number"
                name="life.min"
                value={formData.attributes?.life.min || ''}
                onChange={handleChange}
                placeholder="Life Min"
            />
            <input
                type="number"
                name="life.max"
                value={formData.attributes?.life.max || ''}
                onChange={handleChange}
                placeholder="Life Max"
            />
            <input
                type="number"
                name="male_weight.min"
                value={formData.attributes?.male_weight.min || ''}
                onChange={handleChange}
                placeholder="Male Weight Min"
            />
            <input
                type="number"
                name="male_weight.max"
                value={formData.attributes?.male_weight.max || ''}
                onChange={handleChange}
                placeholder="Male Weight Max"
            />
            <input
                type="number"
                name="female_weight.min"
                value={formData.attributes?.female_weight.min || ''}
                onChange={handleChange}
                placeholder="Female Weight Min"
            />
            <input
                type="number"
                name="female_weight.max"
                value={formData.attributes?.female_weight.max || ''}
                onChange={handleChange}
                placeholder="Female Weight Max"
            />
            <label>
                Hypoallergenic:
                <input
                    type="checkbox"
                    name="hypoallergenic"
                    checked={formData.attributes?.hypoallergenic || false}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Save</button>
        </form>
    );
};

export default NewRecord;