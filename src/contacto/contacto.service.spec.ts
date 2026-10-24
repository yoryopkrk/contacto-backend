import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MailService } from '../mail/mail.service';
import { AUTO_REPLY_DAILY_LIMIT, ContactoService } from './contacto.service';
import { Contacto } from './contacto.entity';

describe('ContactoService.create', () => {
  let service: ContactoService;
  let counts: { sameAddress: number; total: number };

  const qb = () => {
    const builder: any = {
      where: jest.fn(() => builder),
      andWhere: jest.fn(() => builder),
      clone: jest.fn(() => qb()),
      getCount: jest.fn(),
    };
    return builder;
  };
  let queries: any[];

  const repo = {
    create: jest.fn((d: object) => d),
    save: jest.fn((d: object) => Promise.resolve({ id: 7, ...d })),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const mail = { notifyOwner: jest.fn(), sendAutoReply: jest.fn() };

  const dto = { nombre: 'Ana', correo: 'ana@x.cl', comentario: 'hola', origen: 'portafolio' };
  const flush = () => new Promise((r) => setImmediate(r));

  beforeEach(async () => {
    jest.clearAllMocks();
    counts = { sameAddress: 0, total: 0 };
    queries = [];
    repo.createQueryBuilder.mockImplementation(() => {
      const root = qb();
      root.clone.mockImplementation(() => {
        const q = qb();
        queries.push(q);
        // la primera consulta clonada es "misma direccion", la segunda es el total
        q.getCount.mockImplementation(() =>
          Promise.resolve(queries.indexOf(q) % 2 === 0 ? counts.sameAddress : counts.total),
        );
        return q;
      });
      return root;
    });

    const module = await Test.createTestingModule({
      providers: [
        ContactoService,
        { provide: getRepositoryToken(Contacto), useValue: repo },
        { provide: MailService, useValue: mail },
      ],
    }).compile();
    service = module.get(ContactoService);
  });

  it('guarda el contacto, avisa a Jorge y responde automaticamente', async () => {
    const saved = await service.create(dto);
    await flush();

    expect(saved.id).toBe(7);
    expect(mail.notifyOwner).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }));
    expect(mail.sendAutoReply).toHaveBeenCalledWith(expect.objectContaining({ correo: 'ana@x.cl' }));
    expect(repo.update).toHaveBeenCalledWith(7, { respuestaEnviadaAt: expect.any(Date) });
  });

  it('no repite la respuesta automatica a la misma direccion en 24 h, pero sigue avisando a Jorge', async () => {
    counts.sameAddress = 1;

    await service.create(dto);
    await flush();

    expect(mail.notifyOwner).toHaveBeenCalled();
    expect(mail.sendAutoReply).not.toHaveBeenCalled();
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('respeta el tope diario de respuestas automaticas', async () => {
    counts.total = AUTO_REPLY_DAILY_LIMIT;

    await service.create(dto);
    await flush();

    expect(mail.sendAutoReply).not.toHaveBeenCalled();
  });

  it('si falla el envio, el contacto igual se guarda y no se marca como respondido', async () => {
    mail.notifyOwner.mockRejectedValueOnce(new Error('resend caido'));
    mail.sendAutoReply.mockRejectedValueOnce(new Error('resend caido'));

    await expect(service.create(dto)).resolves.toMatchObject({ id: 7 });
    await flush();

    expect(repo.update).not.toHaveBeenCalled();
  });
});
