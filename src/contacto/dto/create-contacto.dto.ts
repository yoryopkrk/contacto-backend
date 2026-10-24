import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @MaxLength(254)
  correo: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  comentario: string;

  // Identificador corto del sitio que envia el mensaje, ej: 'portafolio', 'juego-orbital-spheres'.
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  origen: string;

  @IsOptional()
  @IsInt()
  leido?: number;

  @IsOptional()
  @IsInt()
  id_tipo_notificacion?: number;
}
