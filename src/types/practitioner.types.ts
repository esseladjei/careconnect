import { Practitioner } from '@/entities/practitioner.entity.js';

export interface Locations {
   location: string;
}

export interface FilteredPractitioners {
   data: Practitioner[];
   total: number;
   page: number;
   pages: number;
}

export interface PractitionerQuery {
   location?: string;
   experience?: string;
   specialization?: string;
   appointment_type?: string;
   availability?: string
   fee?: string;
   specialisations?: string;
   page?: string;
   limit?: string;
}
