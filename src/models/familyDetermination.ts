import { Family } from './family';
import { User } from './user';

export interface FamilyDetermination { 
    id: number;
    numberOfPeople?: number;
    income?: number;
    determinationDate?: Date;
    familyId: number;
    family?: Family;
    readonly authorId?: number;
    author?: User;
    readonly updatedAt?: Date;
}