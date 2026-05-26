import { Request, Response } from "express";
import { InteractionsService } from "./interactions.service";

export class InteractionsController {
  //////////////////////////////////////////////////////
  // GET
  //////////////////////////////////////////////////////

  static async getInteractions(
    req: any,
    res: Response
  ) {
    const modId = Number(req.params.id);

    const data =
      await InteractionsService.getInteractions(
        modId,
        req.userId
      );

    res.json(data);
  }

  //////////////////////////////////////////////////////
  // LIKE
  //////////////////////////////////////////////////////

  static async toggleLike(
    req: any,
    res: Response
  ) {
    const modId = Number(req.params.id);

    const data =
      await InteractionsService.toggleLike(
        modId,
        req.userId
      );

    res.json(data);
  }

  //////////////////////////////////////////////////////
  // FAVORITE
  //////////////////////////////////////////////////////

  static async toggleFavorite(
    req: any,
    res: Response
  ) {
    const modId = Number(req.params.id);

    const data =
      await InteractionsService.toggleFavorite(
        modId,
        req.userId
      );

    res.json(data);
  }
}