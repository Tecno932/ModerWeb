import { Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";

import { VersionService } from "./version.service";

import { createVersionSchema } from "../../validations/version.schema";

export const createVersion =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const parsed =
        createVersionSchema.parse(
          req.body
        );

      const version =
        await VersionService.createVersion(
          parsed,
          req.userId!,
          Number(req.params.id)
        );

      res.json(version);

    }
  );

export const getVersions =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const versions =
        await VersionService.getVersions(
          Number(req.params.id)
        );

      res.json(versions);

    }
  );

export const updateVersion =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const version =
        await VersionService.updateVersion(
          Number(req.params.id),
          req.userId!,
          req.body.version
        );

      res.json(version);

    }
  );

export const deleteVersion =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const result =
        await VersionService.deleteVersion(
          Number(req.params.id),
          req.userId!
        );

      res.json(result);

    }
  );