import { BadRequestError } from "./errors";

const allowedMimeTypes = [
  "application/java-archive",
  "application/zip",
];

export async function validateFileBuffer(buffer: Buffer) {
  const { fileTypeFromBuffer } = await import("file-type");

  const type = await fileTypeFromBuffer(buffer);

  if (!type) {
    throw new BadRequestError("No se pudo detectar el tipo de archivo");
  }

  if (!allowedMimeTypes.includes(type.mime)) {
    throw new BadRequestError(
      `Tipo de archivo no permitido: ${type.mime}`
    );
  }

  return type;
}