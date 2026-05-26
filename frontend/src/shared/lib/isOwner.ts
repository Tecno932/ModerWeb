export function isOwner(userId: number, authorId: number) {
  return userId === authorId;
}