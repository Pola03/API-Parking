import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '@prisma/client';

describe('User API (e2e)', () => {
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

  // Ejemplo de prueba de creación de usuario
//   it('/vehicle (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/vehicle')
//       .set('Authorization', `Bearer ${authToken}`)
//       .expect(200)
//       .expect((res) => {
//         expect(Array.isArray(res.body)).toBe(true);

//         res.body.forEach((vehicle : object) => {
//           expect(vehicle).toHaveProperty('id');
//           expect(vehicle).toHaveProperty('license_vehicle');
//           expect(vehicle).toHaveProperty('model_vehicle');
//           expect(vehicle).toHaveProperty('color_vehicle');
//           expect(vehicle).toHaveProperty('clientId');
//         });
//       });
//   });

});
