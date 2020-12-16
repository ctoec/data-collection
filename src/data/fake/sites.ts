import { Region } from '../../../client/src/shared/models';
import { beauxbatons, durmstrang, hogwarts } from './organizations';

export const sitesByOrgName = {
  [hogwarts.providerName]: [
    {
      siteName: 'Gryfinndor Childcare',
      titleI: false,
      region: Region.East,
    },
    {
      siteName: 'Hufflepuff Childcare',
      titleI: false,
      region: Region.East,
    },
    {
      siteName: "Rowena Ravenclaw's Roost for Rambunctious Rascals",
      titleI: true,
      region: Region.NorthCentral,
    },
    {
      siteName: 'Slytherin Childcare',
      titleI: false,
      region: Region.East,
    },
    {
      siteName: 'Diagon Alley Childcare',
      titleI: false,
      region: Region.East,
    },
    {
      siteName: 'Hogsmeade Childcare',
      titleI: true,
      region: Region.NorthCentral,
    },
    {
      siteName: 'Knockturn Alley Childcare',
      titleI: false,
      region: Region.SouthCentral,
    },
    {
      siteName: 'Grimmauld Place Childcare',
      titleI: false,
      region: Region.East,
    },
  ],
  [beauxbatons.providerName]: [
    {
      siteName: 'Delacoeur Day Care',
      titleI: false,
      region: Region.East,
    },
    {
      siteName: 'Maxime Childcare',
      titleI: false,
      region: Region.East,
    },
  ],
  [durmstrang.providerName]: [
    {
      siteName: 'Future Quidditch Prodigy Academy',
      titleI: false,
      region: Region.East,
    },
  ],
};
