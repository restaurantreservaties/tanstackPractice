import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create, update } from '../fakeDatabase/databaseFaker';
import { Breed } from '../types/breedsData';

const NewRecord: React.FC = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Partial<Breed>>({
        id: undefined,
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

    const createMutation = useMutation({
        // De daadwerkelijke mutatiefunctie
        mutationFn: () => {
            alert('MUTATIONFN: Optimistische update is uitgevoerd, nu de echte mutatie uitvoeren!');
            return create(formData as Breed);
        }  ,
    
        // Wordt direct uitgevoerd wanneer de mutatie start
        onMutate: async (newBreed: Breed) => {
            console.log('Mutatie gestart: ', newBreed);
    
            const ok = confirm('ONMUTATE: Optimistische mutatie uitvoeren?');
            if (!ok) {
                console.log('Actie geannuleerd door gebruiker.');
                return;
            }
    
            const queryKey = ['breeds'];
            console.log('Annuleren van lopende queries voor:', queryKey);
            await queryClient.cancelQueries({ queryKey });
    
            // Huidige data ophalen 
            const previousBreeds = queryClient.getQueryData<Breed[]>(queryKey);
            console.log('Vorige data opgehaald:', previousBreeds);
    
            // Cache optimistisch bijwerken met nieuwe data
            if (previousBreeds) {
                queryClient.setQueryData<Breed[]>(queryKey, [...previousBreeds, newBreed]);
            } else {
                queryClient.setQueryData<Breed[]>(queryKey, [newBreed]);
            }
            console.log('Cache bijgewerkt met nieuwe data.');
    
            // Vorige data teruggeven voor rollback bij fout
            return { previousBreeds };
        },
    
        // Wordt uitgevoerd bij een succesvolle mutatie
        onSuccess: (data, variables, context) => {
            console.log('Mutatie succesvol:', data, context);
            console.log('Mutatie-variabelen:', variables);
    
            alert('ONSUCCESS: Breed created successfully!');
            // Data opnieuw ophalen 
             queryClient.invalidateQueries({ queryKey: ['breeds'] });
        },
    
        // Wordt uitgevoerd als de mutatie mislukt
        onError: (error, variables, context) => {
            alert('ONERROR: Fout opgetreden bij mutatie');
            console.log('Mutatie-variabelen:', variables, error);
            if (context?.previousBreeds) {
                console.log('Rollback wordt uitgevoerd naar vorige data:', context.previousBreeds);
                queryClient.setQueryData(['breeds'], context.previousBreeds);
            }
        },
    
        // Wordt altijd uitgevoerd (ongeacht succes of fout)
        onSettled: () => {
            alert('ONSETTLED: Mutatie uitgevoerd');
            console.log('Mutatie afgehandeld.');
        },
    });
    

    const updateMutation = useMutation({
        mutationFn: ({ id, breed }: { id: string; breed: Breed }) => update(id, breed),
        onSuccess: () => {
            alert('Breed updated successfully!');
            // queryClient.invalidateQueries({ queryKey: ['breeds'] });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData((prev) => {
            const updatedFormData = { ...prev };
            if (name.includes('.')) {
                const keys = name.split('.');
                let nestedObject: any = updatedFormData;
                keys.slice(0, -1).forEach((key) => {
                    nestedObject[key] = nestedObject[key] || {};
                    nestedObject = nestedObject[key];
                });
                nestedObject[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
            } else {
                (updatedFormData as any)[name] = type === 'checkbox' ? checked : value;
            }
            return updatedFormData;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.id) {
            updateMutation.mutate({ id: formData.id, breed: formData as Breed });
        } else {
            createMutation.mutate(formData as Breed);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    name="attributes.name"
                    value={formData.attributes?.name || ''}
                    onChange={handleChange}
                    placeholder="Name"
                />
            </div>
            <div>
                <textarea
                    name="attributes.description"
                    value={formData.attributes?.description || ''}
                    onChange={handleChange}
                    placeholder="Description"
                />
            </div>
            <div>
                <input
                    type="number"
                    name="attributes.life.min"
                    value={formData.attributes?.life.min || ''}
                    onChange={handleChange}
                    placeholder="Life Min"
                />
            </div>
            <div>
                <input
                    type="number"
                    name="attributes.life.max"
                    value={formData.attributes?.life.max || ''}
                    onChange={handleChange}
                    placeholder="Life Max"
                />
            </div>
            <div>
                <input
                    type="number"
                    name="attributes.male_weight.min"
                    value={formData.attributes?.male_weight.min || ''}
                    onChange={handleChange}
                    placeholder="Male Weight Min"
                />
            </div>
            <div>
                <input
                    type="number"
                    name="attributes.male_weight.max"
                    value={formData.attributes?.male_weight.max || ''}
                    onChange={handleChange}
                    placeholder="Male Weight Max"
                />
            </div>
            <div>
                <input
                    type="number"
                    name="attributes.female_weight.min"
                    value={formData.attributes?.female_weight.min || ''}
                    onChange={handleChange}
                    placeholder="Female Weight Min"
                />
            </div>
            <div>
                <input
                    type="number"
                    name="attributes.female_weight.max"
                    value={formData.attributes?.female_weight.max || ''}
                    onChange={handleChange}
                    placeholder="Female Weight Max"
                />
            </div>
            <div>
                <label>
                    Hypoallergenic:
                    <input
                        type="checkbox"
                        name="attributes.hypoallergenic"
                        checked={formData.attributes?.hypoallergenic || false}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {formData.id ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default NewRecord;
