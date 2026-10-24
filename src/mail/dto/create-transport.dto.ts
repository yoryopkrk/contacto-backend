import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// Obsoleto: se conserva solo para que el front antiguo no reciba un 400 mientras se actualiza.
export class CreateTransportDto {
  @IsIn([0, 1])
  cualNotificacion: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  mensaje?: string;
}
