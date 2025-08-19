import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Reservations API (e2e)', () => {
  let app: INestApplication;
  let authToken: string; // Token de autenticación

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Autenticarse para obtener el token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@gmail.com', password: 'password' })
      .expect(200);

    // Guardar el token de acceso
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  // Ejemplo de eliminación de una reservación con autenticación y autorización de rol
  // it('/reservations (DELETE)', () => {
  //   const reservationId = 10; 
  //   const isCancellation = true; 

  //   return request(app.getHttpServer())
  //     .delete('/reservations')
  //     .set('Authorization', `Bearer ${authToken}`) 
  //     .query({ id: reservationId, is_cancellation: isCancellation }) 
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('id');
  //       expect(res.body.init_dateTime).toBe('2024-11-01T09:30:00.000Z');
  //       expect(res.body.end_dateTime).toBe('2024-11-01T10:31:00.000Z');
  //       expect(res.body.clientId).toBe(3);
  //       expect(res.body.vehicleId).toBe(1);
  //       expect(res.body.placeId).toBe(8);
  //     });
  // });
});
