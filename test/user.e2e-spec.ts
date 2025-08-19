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
  // it('/user (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/user')
  //     .set('Authorization', `Bearer ${authToken}`) 
  //     .send({
  //       role: Role.ADMIN,
  //       email: 'testadmin1@gmail.com',
  //       name: 'testadmin1',
  //       phone: '5424262',
  //       password: 'testadminpassword',
  //     })
  //     .expect(201)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('id');
  //       expect(res.body.name).toBe('testadmin1');
  //       expect(res.body.role).toBe(Role.ADMIN);
  //       expect(res.body.email).toBe('testadmin1@gmail.com');
  //       expect(res.body.phone).toBe('5424262');
  //     });
  // });

});
