import { HttpException, HttpStatus } from "@nestjs/common";

export function convertAndVerifyNumber(value: number): number {
  const valueConverted = Number(value);

  if (isNaN(valueConverted)) {
    throw new HttpException(`O valor informado deve ser do tipo numérico: ${value}`, 
    HttpStatus.BAD_REQUEST
    );
  }

  return valueConverted;
}
