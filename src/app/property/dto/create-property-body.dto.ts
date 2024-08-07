export class CreatePropertyFacilityDto {
    type: string;
    facility: string;
    isHighlight: boolean;
}

export class CreatePropertyImageDto {
    image: string;
    isHighlight: boolean;
}

export class CreatePropertyDto {
    address: string;
    city: string;
    state: string;
    country: string;
    type: string;
    description: string;
    createdBy: string;
    updatedBy: string;
    facilities: CreatePropertyFacilityDto[];
    images: CreatePropertyImageDto[];
}