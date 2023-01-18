import { HttpException, HttpStatus } from '@nestjs/common';
import { ERoles } from './ETypes';


export const setPermissions = (roles: ERoles) => {

  if (!roles) throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);
  if (roles === ERoles.ROLE_ADMIN) return [
    'create-employee',
    'edit-employee',
    'delete-employee',
    'list-employee',
    'list-driver',
    'create-driver',
    'edit-driver',
    'delete-driver',
    'list-path',
    'create-path',
    'edit-path',
    'delete-path',
    'list-vehicle',
    'create-vehicle',
    'edit-vehicle',
    'delete-vehicle',
    'create-route',
    'edit-route',
    'delete-route',
    'list-route'
  ];

  if (roles === ERoles.ROLE_EMPLOYEE) return [
    'list-driver',
    'list-path',
    'list-vehicle',
    'list-route'
  ];

  if (roles === ERoles.ROLE_DRIVER) return [
    'list-driver',
    'list-path',
    'edit-path',
    'edit-driver',
    'list-vehicle',
    'edit-vehicle',
    'edit-route',
    'list-route'
  ];
}