import { ModService } from "../../services/mod.service";

export async function getProject(req: any, res: any) {
  try {
    const id = Number(req.params.id);

    const mod = await ModService.getProjectById(
      id,
      req.userId
    );

    res.json(mod);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
}

export async function updateProject(req: any, res: any) {
  try {
    const id = Number(req.params.id);

    const mod = await ModService.updateMod(
      id,
      req.body,
      req.userId
    );

    res.json(mod);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
}