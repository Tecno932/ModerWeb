import { InviteService } from "../services/invite.service";

export async function createInvite(req: any, res: any) {
  try {
    const { teamId, email, role } = req.body;

    const invite = await InviteService.createInvite(
      teamId,
      email,
      role
    );

    res.json(invite);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function acceptInvite(req: any, res: any) {
  try {
    const { token } = req.params;

    const result = await InviteService.acceptInvite(
      token,
      req.userId
    );

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function rejectInvite(req: any, res: any) {
  try {
    const { token } = req.params;

    const result = await InviteService.rejectInvite(token);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}