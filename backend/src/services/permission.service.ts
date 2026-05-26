import { prisma } from "../lib/prisma";

export class PermissionService {
  static async getUserScopes(userId: number) {
    const roles = await prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    const scopes = new Set<string>();

    for (const r of roles) {
      for (const s of r.role.scopes) {
        scopes.add(s);
      }
    }

    return Array.from(scopes);
  }

  static async hasScope(userId: number, scope: string) {
    const scopes = await this.getUserScopes(userId);
    return scopes.includes(scope);
  }
}