import { buildAutoReply, buildOwnerNotification, escapeHtml, greetingName, singleLine } from './mail-templates';

describe('escapeHtml', () => {
  it('neutraliza etiquetas y comillas', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;',
    );
  });
});

describe('singleLine', () => {
  it('quita saltos de linea (inyeccion de cabeceras) y limita el largo', () => {
    expect(singleLine('Hola\r\nBcc: victima@x.cl')).toBe('Hola Bcc: victima@x.cl');
    expect(singleLine('a'.repeat(200), 10)).toHaveLength(10);
  });
});

describe('greetingName', () => {
  it.each(['Jorge', 'María José', "O'Brien", 'Ana-Lucía', 'J. Pérez'])('acepta %s', (n) => {
    expect(greetingName(n)).toBe(n);
  });

  it.each([
    'visita http://malo.cl',
    'www.malo.cl/premio',
    '<b>x</b>',
    '12345',
    '',
    'a'.repeat(61),
    'Hola\nBcc: x@y.cl',
  ])('rechaza %j', (n) => {
    expect(greetingName(n)).toBeNull();
  });
});

describe('buildAutoReply', () => {
  it('saluda por el nombre cuando es seguro', () => {
    expect(buildAutoReply('Jorge').html).toContain('Hola Jorge,');
  });

  it('con un nombre sospechoso no lo incluye ni deja enlaces', () => {
    const mail = buildAutoReply('Gana un premio en http://malo.cl');
    expect(mail.text.startsWith('Hola,')).toBe(true);
    expect(mail.html).not.toContain('malo.cl');
    expect(mail.text).not.toContain('malo.cl');
  });
});

describe('buildOwnerNotification', () => {
  const base = {
    nombre: '<script>x</script>',
    correo: 'a@b.cl',
    telefono: null,
    comentario: 'linea 1\n<a href="http://malo.cl">clic</a>',
    origen: 'portafolio',
  };

  it('escapa nombre y comentario en el HTML', () => {
    const mail = buildOwnerNotification(base);
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).not.toContain('<a href');
    expect(mail.html).toContain('&lt;a href=&quot;http://malo.cl&quot;&gt;');
    expect(mail.html).toContain('linea 1<br>');
  });

  it('el asunto va en una sola linea aunque el nombre traiga saltos', () => {
    expect(buildOwnerNotification({ ...base, nombre: 'Ana\r\nBcc: x@y.cl' }).subject).not.toMatch(/[\r\n]/);
  });
});
