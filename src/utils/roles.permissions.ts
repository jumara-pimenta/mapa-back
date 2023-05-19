import { HttpException, HttpStatus } from '@nestjs/common';
import { ERoles, ERolesBackOfficeTypes } from './ETypes';

export const setPermissions = (roles: ERoles) => {
  if (!roles)
    throw new HttpException('Não autorizado', HttpStatus.UNAUTHORIZED);

  if (roles === ERoles.ROLE_ADMIN)
    return [
      'ADMIN',
      'create-employee',
      'edit-employee',
      'delete-employee',
      'list-employee',
      'export-employees',
      'import-employees',
      'list-driver',
      'create-driver',
      'edit-driver',
      'delete-driver',
      'import-drivers',
      'list-path',
      'create-path',
      'edit-path',
      'delete-path',
      'list-vehicle',
      'create-vehicle',
      'edit-vehicle',
      'delete-vehicle',
      'import-vehicles',
      'create-route',
      'edit-route',
      'delete-route',
      'list-route',
      'edit-employeeOnPath',
      'list-employeeOnPath',
      'create-pin',
      'delete-pin',
      'edit-pin',
      'list-pin',
      'create-sinister',
      'list-sinister',
      'edit-sinister',
      'list-historic',
    ];

  if (roles === ERoles.ROLE_EMPLOYEE)
    return [
      'list-driver',
      'list-path',
      'list-vehicle',
      'list-route',
      'employee-first-access',
      'edit-employeeOnPath',
      'list-employeeOnPath',
      'list-employee',
      'create-sinister',
      'list-sinister',
      'edit-sinister',
    ];

  if (roles === ERoles.ROLE_DRIVER)
    return [
      'list-driver',
      'list-path',
      'edit-path',
      'edit-driver',
      'list-vehicle',
      'edit-vehicle',
      'edit-route',
      'list-route',
      'driver-first-access',
      'edit-employeeOnPath',
      'list-employeeOnPath',
      'list-employee',
      'create-sinister',
      'list-sinister',
      'edit-sinister',
    ];

  if (roles === ERolesBackOfficeTypes.ROLE_SUPERVISOR)
    return [
      'list-driver',
      'list-path',
      'list-vehicle',
      'list-route',
      'list-employeeOnPath',
      'list-employee',
      'list-sinister',
    ];

  if (roles === ERolesBackOfficeTypes.ROLE_MONITOR)
    return [
      'list-path',
      'list-route',
      'list-employeeOnPath',
      'list-employee',
      'list-sinister',
      'create-employeeOnPath',
      'edit-employeeOnPath',
      'delete-employeeOnPath',
      'create-pin',
      'delete-pin',
      'create-sinister',
      'edit-sinister',
      'create-employee',
      'edit-employee',
      'delete-employee',
      'create-route',
      'edit-route',
      'delete-route',
      'create-path',
      'edit-path',
      'delete-path',
    ];
};
