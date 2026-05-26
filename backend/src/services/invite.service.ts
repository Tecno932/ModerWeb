import { prisma } from "../lib/prisma";
import crypto from "crypto";
import {  BadRequestError, NotFoundError, UnauthorizedError,} from "../utils/errors";

export class InviteService {
  static async createInvite(
    teamId: number,
    email: string,
    role: string
  ) {
    const token = crypto.randomBytes(32).toString("hex");

    const invite = await prisma.teamInvite.create({
      data: {
        teamId,
        email,
        role,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });

    return invite;
  }

  static async acceptInvite(token: string, userId: number) {
    const invite = await prisma.teamInvite.findUnique({
      where: { token },
    });

    if (!invite) throw new NotFoundError("Invitación inválida");

    if (invite.expiresAt < new Date()) {
      throw new BadRequestError("Invitación expirada");
    }

    await prisma.teamMember.create({
      data: {
        teamId: invite.teamId,
        userId,
        role: invite.role,
      },
    });

    await prisma.teamInvite.delete({
      where: { id: invite.id },
    });

    return { success: true };
  }

  static async rejectInvite(token: string) {
    await prisma.teamInvite.delete({
      where: { token },
    });

    return { success: true };
  }
}