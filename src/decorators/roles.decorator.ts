import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'permissions';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
