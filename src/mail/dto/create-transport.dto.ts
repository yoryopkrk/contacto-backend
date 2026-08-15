import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTransportDto {
  // 0 = notificacion para Jorge, 1 = respuesta automatica para quien escribio
  @IsIn([0, 1])
  cualNotificacion: number;

  @IsString()
  @MinLength(1)
  nombre: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  mensaje?: string;
}
