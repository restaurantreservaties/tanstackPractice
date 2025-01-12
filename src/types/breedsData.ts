export interface BreedsData {
    data: Breed[];
    links: {
        current: string;
        last: string;
        next: string;
        self: string;
    };
}


export interface Breed {
    id: string;
        type: "breeds";
        attributes: {
            name: string,
            description: string,
            life: {
                max: number
                min: number
            }
            male_weight:{
                max: number
                min: number
            }
            female_weight:{
                max: number
                min: number
            }
            hypoallergenic: boolean
        };
}