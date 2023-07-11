export enum ETypePin {
  CONVENTIONAL = 'CONVENCIONAL',
  ESPECIAL = 'ESPECIAL',
}

export enum ETypeRoute {
  CONVENTIONAL = 'CONVENCIONAL',
  EXTRA = 'EXTRA',
}

export enum ETypeRouteExport {
  CONVENTIONAL = 'CONVENCIONAL',
  EXTRA = 'EXTRA',
}

export enum EStatusRoute {
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'EM ANDAMENTO',
  FINISHED = 'FINALIZADA',
}

export enum ETypePath {
  ONE_WAY = 'IDA',
  RETURN = 'VOLTA',
  ROUND_TRIP = 'IDA E VOLTA',
}

export enum ETypePathExtra {
  RETURN = 'VOLTA',
  ROUND_TRIP = 'IDA E VOLTA',
}

export enum EStatusPath {
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'EM ANDAMENTO',
  FINISHED = 'FINALIZADA',
}

export enum ETypeCreationPin {
  IS_EXISTENT = 'EXISTENTE',
  IS_NEW = 'NOVO',
}

export enum ETypeEditionPin {
  IS_EXISTENT = 'EXISTENTE',
  IS_NEW = 'NOVO',
}

export enum ERoles {
  ROLE_ADMIN = 'ADMIN',
  ROLE_EMPLOYEE = 'EMPLOYEE',
  ROLE_DRIVER = 'DRIVER',
}

export enum ERolesBackOfficeTypes {
  ROLE_ADMIN = 'ADMIN',
  ROLE_MONITOR = 'MONITOR',
  ROLE_SUPERVISOR = 'SUPERVISOR',
}

export enum ETypePeriodHistory {
  DAILY = 'DIÁRIO',
  WEEKLY = 'SEMANAL',
  BIWEEKLY = 'QUINZENAL',
  MONTHLY = 'MENSAL',
}

export enum ETypeShiftRotue {
  FIRST = 'PRIMEIRO',
  SECOND = 'SEGUNDO',
  THIRD = 'TERCEIRO',
  SPECIAL = 'TURNO ESPECIAL',
}

export enum ETypeShiftEmployee {
  FIRST = 'PRIMEIRO',
  SECOND = 'SEGUNDO',
  THIRD = 'TERCEIRO',
  NOT_DEFINED = 'SEM TURNO ESTABELECIDO',
}
export enum ETypeCategoryDrivers {
  C = 'C',
  D = 'D',
  E = 'E',
}

export enum ETypeShiftEmployeeExports {
  FIRST = '07:30 às 17:30',
  SECOND = '17:30 às 02:30',
  THIRD = '03:30 às 12:00',
  NOT_DEFINED = 'SEM TURNO ESTABELECIDO',
}

export enum EShiftType {
  FIRST = 'Turno 1',
  SECOND = 'Turno 2',
  THIRD = 'Turno 3',
  EXTRA = 'Extra',
}
