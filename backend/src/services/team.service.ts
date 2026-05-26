import { prisma } from "../lib/prisma";
import { RoleScopes } from "../constants/roles";

export class TeamService {
  static async getMembership(userId: number, teamId: number) {
    return prisma.teamMember.findFirst({
      where: { userId, teamId },
    });
  }

  static async hasScope(
    userId: number,
    mod: any,
    scope: string
  ) {
    // dueño directo (fallback)
    if (mod.authorId === userId) return true;

    if (!mod.teamId) return false;

    const membership = await this.getMembership(userId, mod.teamId);

    if (!membership) return false;

    const roleScopes = RoleScopes[membership.role] || [];

    // soporte para scopes personalizados (futuro)
    if (membership.scopes && membership.scopes.length > 0) {
      return membership.scopes.includes(scope);
    }

    return roleScopes.includes(scope);
  }
}