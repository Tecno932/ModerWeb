import { BadRequestError } from "../../utils/errors";

import type {
  CreateModInput,
} from "./mod.types";

export function validateCreateMod(
  data: CreateModInput
) {
  if (!data.title?.trim()) {
    throw new BadRequestError(
      "Title requerido"
    );
  }

  if (!data.description?.trim()) {
    throw new BadRequestError(
      "Description requerida"
    );
  }

  if (!data.platform) {
    throw new BadRequestError(
      "Platform requerida"
    );
  }

  if (!data.type) {
    throw new BadRequestError(
      "Type requerido"
    );
  }
}