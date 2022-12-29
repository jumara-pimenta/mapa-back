import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDriverDTO {
  @IsString({ message: '[name] O nome deve ser do tipo string.' })
  @IsOptional()
  name?: string;

  @IsString({ message: '[cpf] O CPF deve ser do tipo string.' })
  @IsOptional()
  cpf?: string;

  @IsString({ message: '[cnh] A CNH deve ser do tipo string.' })
  @IsOptional()
  cnh?: string;

  @IsDateString({} ,{ message: '[validation] A validade deve ser do tipo date.' })
  @IsOptional()
  validation?: Date;

  @IsString({ message: '[category] A categoria deve ser do tipo string.' })
  @IsOptional()
  category?: string;
}
