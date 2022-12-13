export enum ETypePin {
  CONVENTIONAL = 'CONVENCIONAL',
  ESPECIAL = 'ESPECIAL',
  EXTRA = 'EXTRA'
}

export enum ETypeRoute {
  CONVENTIONAL = 'CONVENCIONAL',
  ESPECIAL = 'ESPECIAL',
  EXTRA = 'EXTRA'
}

export enum EStatusRoute {
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'EM ANDAMENTO'
}

export enum ETypePath {
  ONE_WAY = 'IDA',
  RETURN = 'VOLTA',
  ROUND_TRIP = 'IDA E VOLTA'
}

export enum EStatusPath {
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'EM ANDAMENTO',
  FINISHED = 'FINALIZADO'
}

export enum ECreatePin {
  IS_EXISTENT = 'EXISTENTE',
  IS_NEW = 'NOVO'
}
