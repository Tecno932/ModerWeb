import { Request, Response, } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { CosmeticsService } from "./cosmetics.service";

//////////////////////////////////////////////////
// GET ALL
//////////////////////////////////////////////////

export const getCosmetics =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const cosmetics =
        await CosmeticsService.getAll();

      res.json(cosmetics);
    }
  );

//////////////////////////////////////////////////
// GET ONE
//////////////////////////////////////////////////

export const getCosmetic =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const slug =
        req.params.slug;

      if (
        !slug ||
        Array.isArray(slug)
      ) {
        return res.status(400).json({
          error: "Slug inválido",
        });
      }

      const cosmetic =
        await CosmeticsService.getBySlug(
          slug
        );

      res.json(cosmetic);
    }
  );

//////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////

export const createCosmetic =
  asyncHandler(
    async (req: any, res: Response) => {
      const cosmetic =
        await CosmeticsService.create(
          req.body
        );

      res.status(201).json(
        cosmetic
      );
    }
  );

//////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////

export const updateCosmetic =
  asyncHandler(
    async (req: any, res: Response) => {
      const cosmetic =
        await CosmeticsService.update(
          Number(req.params.id),
          req.body
        );

      res.json(cosmetic);
    }
  );

//////////////////////////////////////////////////
// ACTIVATE
//////////////////////////////////////////////////

export const activateCosmetic =
  asyncHandler(
    async (req: any, res: Response) => {
      const cosmetic =
        await CosmeticsService.activate(
          Number(req.params.id)
        );

      res.json(cosmetic);
    }
  );

//////////////////////////////////////////////////
// DEACTIVATE
//////////////////////////////////////////////////

export const deactivateCosmetic =
  asyncHandler(
    async (req: any, res: Response) => {
      const cosmetic =
        await CosmeticsService.deactivate(
          Number(req.params.id)
        );

      res.json(cosmetic);
    }
  );

//////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////

export const deleteCosmetic =
  asyncHandler(
    async (req: any, res: Response) => {
      const result =
        await CosmeticsService.delete(
          Number(req.params.id)
        );

      res.json(result);
    }
  );