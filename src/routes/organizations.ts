import express, { Request, Response } from 'express';
import { Organization, Site } from '../entity';
import { getManager } from 'typeorm';
import * as orgController from '../controllers/organizations';
import * as siteController from '../controllers/sites';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { ApiError, BadRequestError, ForbiddenError, ResourceConflictError } from '../middleware/error/errors';

export const organizationsRouter = express.Router();

organizationsRouter.post(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const { name, sites } = req.body;

      // All or nothing approach to creating new orgs, so if either the
      // org name is taken or *any* site name is taken, fail the whole thing
      const orgNameExists = await orgController.doesOrgNameExist(name);
      const siteNamesAllUnique = await siteController.areSiteNamesUnique(
        sites.map((newSite) => newSite.name)
      );
      if (orgNameExists) {
        throw new ResourceConflictError('Organization name already exists.');
      }
      else if (!siteNamesAllUnique) {
        throw new ResourceConflictError('A site name is already taken.')
      }
      else {
        
        // Create org first so we can give its ID to created sites
        const newOrg = await getManager().save(
          getManager().create(Organization, { providerName: name })
        );
        const createdSites: Site[] = await Promise.all(sites.map(
          async (s) => await getManager().save(
            getManager().create(Site, {
              siteName: s.name,
              titleI: s.titleI,
              region: s.region,
              naeycId: s.naeycId,
              registryId: s.registryId,
              licenseNumber: parseInt(s.licenseNumber),
              facilityCode: parseInt(s.facilityCode),
              organization: newOrg,
              organizationId: newOrg.id,
            })
          )
        ));        
        newOrg.sites = createdSites;
        await getManager().save(newOrg);
        res.status(201).send({ id: newOrg.id });
      }

    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error creating organization: ', err);
      throw new BadRequestError('New organization not created.');
    }
  })
)

organizationsRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const user = req.user;
    if (!user.isAdmin) {
      throw new ForbiddenError();
    }
    const organizations = await orgController.getOrganizations();

    res.send(organizations);
  })
);
