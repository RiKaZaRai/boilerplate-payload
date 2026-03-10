export const checkRole = (roles: string[], user: any): boolean => {
  if (!user) return false;
  return roles.some((role) => user?.role === role);
};
