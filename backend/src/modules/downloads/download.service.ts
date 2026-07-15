import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
} from "../../utils/errors";

export class DownloadService {

  //////////////////////////////////////////////////
  // DOWNLOAD
  //////////////////////////////////////////////////

  static async download(
    versionId: number
  ) {

    if (!versionId) {
      throw new BadRequestError(
        "versionId inválido"
      );
    }

    const version =
      await prisma.modVersion.findUnique({
        where: {
          id: versionId,
        },
        include: {
          files: true,
          mod: true,
        },
      });

    if (
      !version ||
      version.files.length === 0
    ) {
      throw new NotFoundError(
        "No hay archivo"
      );
    }

    const file =
      version.files.find(
        file => file.isPrimary
      ) ??
      version.files[0];

    await prisma.modFile.update({
      where: {
        id: file.id,
      },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    await prisma.mod.update({
      where: {
        id: version.modId,
      },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    return file.url;
  }
}