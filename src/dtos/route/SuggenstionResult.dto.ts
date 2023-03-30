export type SuggenstionResultDTO = ErrorResponse | SuccessResponse;

interface ErrorResponse {
  description: string;
  status: number;
  erro: string;
}

interface SuccessResponse {
  description: string;
  status: number;
}
