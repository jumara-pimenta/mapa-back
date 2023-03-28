import { Transform, TransformFnParams, Type } from "class-transformer";
import { ArrayMinSize, IsDefined, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class pin {
    id: string;
    title: string;
    local: string;
    details: string;
    lat: number;
    lng: number;
}
class employees {
  id: string;
    name: string;
    registration: string;
    distance: string;
    sequency : number
     pins : pin[]
}
export class SuggestionExtra {

    employee : employees[]
    distance: string
    totalDurationTime: number
}

class suggestedExtra{
    @IsString({message : 'O nome da Rota deve ser do tipo texto.'})
    @IsDefined({message : 'O nome da Rota deve ser preenchido.'})
    @IsNotEmpty({message : 'O nome da Rota deve ser preenchido.'})
    @Transform(({ value }: TransformFnParams) => value?.trim())
    description : string
    @IsString({message : 'O nome da Rota deve ser do tipo texto.'})
    @IsOptional()
    driver? : string
    @IsString({message : 'O nome da Rota deve ser do tipo texto.'})
    @IsOptional()
    vehicle? : string
    @IsString({each: true, message : 'Os colaboradores deve ser do tipo texto.'})
    @ArrayMinSize(2, {
        message: '[employeesIds] Deve ser informado ao menos dois ids de funcionário.',
        })
    employeesIds : string[]
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsDefined({message : 'A duração da Rota deve ser preenchida.'})
    time : string
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsDefined({message : 'A distância da Rota deve ser preenchida.'})
    distance : string
}

export class CreateSuggestionExtra {
    @ValidateNested({ each: true })
    @Type(() => suggestedExtra)
    suggestedExtras : suggestedExtra[]
}