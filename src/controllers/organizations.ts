import { Organization } from "../entity";
import { getManager } from "typeorm";

export async function doesOrgNameExist(name: string) {
  const existing = await getManager().findOne(
    Organization,
    { where: { providerName: name }}
  );
  return !!existing;
};