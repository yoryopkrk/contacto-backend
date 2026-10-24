import { Contacto } from '../contacto/contacto.entity';

export interface MailContent {
  subject: string;
  text: string;
  html: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Todo texto que escribe el visitante y va dentro de un HTML pasa por aqui.
export function escapeHtml(value: string): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

// Una sola linea sin saltos: para asuntos de correo (evita inyeccion de cabeceras).
export function singleLine(value: string, max = 80): string {
  return String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

// La respuesta automatica sale a una direccion que escribio un desconocido: solo se saluda por el
// nombre si son letras (con espacios, apostrofes, puntos o guiones). Un "nombre" con una URL o
// simbolos no se usa, asi nadie puede colar enlaces en un correo que sale de este dominio.
const SAFE_NAME = /^[\p{L}\p{M}][\p{L}\p{M}' .-]{0,59}$/u;

export function greetingName(nombre: string): string | null {
  const name = String(nombre ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  return SAFE_NAME.test(name) ? name : null;
}

export function buildOwnerNotification(c: Pick<Contacto, 'nombre' | 'correo' | 'telefono' | 'comentario' | 'origen'>): MailContent {
  const nombre = singleLine(c.nombre, 60);
  const telefono = c.telefono ? singleLine(c.telefono, 30) : '';
  const cabecera = `${nombre} (${singleLine(c.correo, 254)})${telefono ? ` tel. ${telefono}` : ''}`;

  return {
    subject: `Nuevo mensaje de ${nombre} (${singleLine(c.origen, 40)})`,
    text: `${cabecera} escribio:\n\n${c.comentario}`,
    html:
      `<p><strong>${escapeHtml(nombre)}</strong> (${escapeHtml(c.correo)})` +
      `${telefono ? ` tel. ${escapeHtml(telefono)}` : ''} escribio:</p>` +
      `<p>${escapeHtml(c.comentario).replace(/\r?\n/g, '<br>')}</p>`,
  };
}

export function buildAutoReply(nombre: string): MailContent {
  const name = greetingName(nombre);
  const saludo = name ? `Hola ${name}` : 'Hola';
  const cuerpo = 'gracias por escribir. Recibi tu mensaje y te respondere a la brevedad.';

  return {
    subject: 'Recibi tu mensaje',
    text: `${saludo}, ${cuerpo}`,
    html: `<p>${escapeHtml(saludo)}, ${cuerpo}</p>`,
  };
}
