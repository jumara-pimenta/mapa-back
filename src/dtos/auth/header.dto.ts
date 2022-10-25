import { IsNotEmpty, IsString } from "class-validator";

export class HeaderDTO {
    @IsString()
    @IsNotEmpty()
    authorization: string;
}
