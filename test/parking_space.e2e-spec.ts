import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '@prisma/client';

describe('Parking Space API (e2e)', () => {
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

//   Ejemplo de obtencion de todas las plazas del estacionamiento
  // it('/parking-space (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/parking-space')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('amount_empty_places');
  //       expect(res.body).toHaveProperty('occupied_places');

  //       res.body.occupied_places.forEach((place : object) => {
  //         expect(place).toHaveProperty('id');
  //         expect(place).toHaveProperty('init_dateTime');
  //         expect(place).toHaveProperty('end_dateTime');
  //         expect(place).toHaveProperty('clientId');
  //         expect(place).toHaveProperty('vehicleId');
  //       });
  //     });
  // });

});
