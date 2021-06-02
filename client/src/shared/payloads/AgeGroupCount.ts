import { AgeGroup } from "../models";

export type AgeGroupCount = {
  [AgeGroup.InfantToddler]: number,
  [AgeGroup.Preschool]: number,
  [AgeGroup.SchoolAge]: number,
}