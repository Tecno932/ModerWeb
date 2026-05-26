export function normalizeError(err: any) {
  if (!err) return { message: "Unknown error" };

  if (err.message) return err;
  if (err.error) return { message: err.error };

  return { message: "Error desconocido" };
}