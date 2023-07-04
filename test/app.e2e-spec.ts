import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app : INestApplication;
  let prisma:PrismaService;
  beforeAll(
    async()=>{
      const moduleRef= await Test.createTestingModule({
        imports:[AppModule]
      }).compile();
      app = moduleRef.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
        })
    );
    await app.init();
    await app.listen(3333);
    prisma= app.get(PrismaService);
    await prisma.onDelete;
    pactum.request.setBaseUrl('http://localhost:3333');
    }
  );
  afterAll(()=>{app.close();});
  describe('Auth',()=>{
     const dto:AuthDto={
          email:'lojen@hotmail.com',
          password:'123',
        };
    describe('Signup',()=>{
      it('should throw if email is empty',()=>{
        return pactum.spec().post('/auth/signup',).withBody(dto.password).expectStatus(400).inspect();
      });
      it('should throw if password is empty',()=>{
        return pactum.spec().post('/auth/signup',).withBody(dto.email).expectStatus(400).inspect();
      });
      it('should throw if no body provided',()=>{
        return pactum.spec().post('/auth/signup',).expectStatus(400).inspect();
      });
      it.todo('should signup',()=>{
        return pactum.spec().post('/auth/signup',).withBody(dto).expectStatus(201).inspect();
      });
    });
    describe('Signin',()=>{
      it('should throw if email is empty',()=>{
        return pactum.spec().post('/auth/signin',).withBody(dto.password).expectStatus(400).inspect();
      });
      it('should throw if password is empty',()=>{
        return pactum.spec().post('/auth/signin',).withBody(dto.email).expectStatus(400).inspect();
      });
      it('should throw if no body provided',()=>{
        return pactum.spec().post('/auth/signin',).expectStatus(400).inspect();
      });
      it.todo('should signin',()=>{
        return pactum.spec().post('/auth/singin').withBody(dto).expectStatus(200).inspect().stores('userAt','access_token');
      });
    });
  });
  describe('User',()=>{
    describe('Get me',()=>{
      it.todo('should get current user',()=>{
        return pactum.spec().withHeaders({Authorization:'Bearer $S{userAt}',}).get('/users/me',).expectStatus(200).inspect();
      });
    });
    describe('Edit user',()=>{
      it.todo('should edit user',()=>{
        const dto:EditUserDto={
          email:'lojen@hotmail.com',
          firstName:'lojen',
        };
        return pactum.spec().post('/users').withHeaders({Authorization:'Bearer $S{userAt}'}).withBody(dto).expectStatus(200).inspect();
      });
    });
  });
  describe('Bookmarks',()=>{
    describe('Create bookmark',()=>{});
    describe('Get bookmark',()=>{});
    describe('Get bookmark by id',()=>{});
    describe('Edit bookmark by id',()=>{});
    describe('Delete bookmark by id',()=>{});


  });
 it.todo('should pass');
});
