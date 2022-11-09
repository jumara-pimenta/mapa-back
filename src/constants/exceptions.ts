export enum PrismaMessageError {
  UNIQUE_CONSTRAINT_VIOLATION = 'Erro de violação de campo único',
  GENERAL_VALIDATION_DATA_ERROR = 'Erro de validação de dados',
}

export enum PrismaCodeError {
  UNIQUE_CONSTRAINT = 'P2002',
}

export enum AppMessageError {
  NO_RESULTS_QUERY = 'Não há resultados para à consulta',
  UNKNOWN_ERROR = 'Erro desconhecido, procure o administrador',
}
