import { FileService } from "../services/file.service";

export async function uploadFile(req: any, res: any) {
  try {
    const file = req.file;

    const result = await FileService.uploadFile(
      file,
      Number(req.params.id),
      req.userId
    );

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}