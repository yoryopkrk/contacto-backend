import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsEmail()
  correo: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsString()
  @MinLength(1)
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
