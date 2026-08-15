import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contactos')
export class Contacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column({ nullable: true })
  telefono: string;

  @Column('text')
  comentario: string;

  // Desde donde se envio el mensaje: 'portafolio', 'juego', etc.
  @Column()
  origen: string;

  @Column({ default: 0 })
  leido: number;

  @Column({ nullable: true })
  id_tipo_notificacion: number;

  @CreateDateColumn()
  createdAt: Date;
}
