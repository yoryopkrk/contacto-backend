import { MailController } from './mail.controller';

describe('MailController.createTransport (obsoleto)', () => {
  it('no envia nada: responde que esta obsoleto', () => {
    const controller = new MailController();
    expect(controller.createTransport({ cualNotificacion: 1, nombre: 'x', email: 'victima@x.cl' })).toEqual({
      enviado: false,
      obsoleto: true,
    });
  });
});
