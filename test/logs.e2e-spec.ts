import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '@prisma/client';

describe('Logs API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Ejemplo de obtencion de los logs
  // it('/logs (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/logs')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(Array.isArray(res.body)).toBe(true);

  //       res.body.forEach((log : object) => {
  //         expect(log).toHaveProperty('_id');
  //         expect(log).toHaveProperty('action');
  //         expect(log).toHaveProperty('userId');
  //         expect(log).toHaveProperty('details');
  //         expect(log).toHaveProperty('createdAt');
  //         expect(log).toHaveProperty('updatedAt');
  //       });
  //     });
  // });

});
