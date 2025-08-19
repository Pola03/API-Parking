import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Role } from '@prisma/client';

describe('Auth API (e2e)', () => {
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

  // Ejemplo de un registro de un usuario
  // it('/auth/register (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/register')
  //     .send({
  //       role: Role.CLIENT,
  //       email: "client2@gmail.com",
  //       name: "client2",
  //       phone: "55558383",
  //       password: "password"
  //     })
  //     .expect(201)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('id');
  //       expect(res.body.name).toBe('client2');
  //       expect(res.body.role).toBe(Role.CLIENT);
  //       expect(res.body.email).toBe('client2@gmail.com');
  //       expect(res.body.phone).toBe('55558383');
  //     });
  // });

  // Ejemplo de un login de un usuario
  // it('/auth/login (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       email: "client2@gmail.com",
  //       password: "password"
  //     })
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body.user).toHaveProperty('id');
  //       expect(res.body).toHaveProperty('token');
  //       expect(res.body.user.name).toBe('client2');
  //       expect(res.body.user.role).toBe(Role.CLIENT);
  //       expect(res.body.user.email).toBe('client2@gmail.com');
  //       expect(res.body.user.phone).toBe('55558383');
  //     });
  // });

});
