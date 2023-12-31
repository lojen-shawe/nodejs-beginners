import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
        return pactum.spec().post('/users').withHeaders({Authorization:'Bearer $S{userAt}'}).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email).inspect();
      });
    });
  });
  describe('Bookmarks',()=>{
    describe('Get empty bookmark',()=>{
      it('should get bookmarks',()=>{
        return pactum.spec().get('/bookmarks').withHeaders({Authorization:'Bearer $S{userAt}'}).expectStatus(200).expectBody([]);
     
      })
    });
    describe('Create bookmark',()=>{
     const dto:CreateBookmarkDto={
      title:'First bookmark',
      link:'https://stackoverflow.com/questions/68246739/prismaclientvalidationerror-invalid-prisma-user-create-invocation'
     }
      it('should create bookmark',()=>{
        return pactum.spec.post('/bookmark').withHeaders({Authorization:'Bearer $S{userAt}'}).withBody(dto).expectStatus(201).expectBody([]).stores('bookmarkId','id').inspect();
      })
    });
    describe('Get bookmarks',()=>{
      it('should get bookmarks',()=>{
        return pactum.spec().get('/bookmarks').withHeaders({Authorization:'Bearer $S{userAt}'}).expectStatus(200).expectJsonLength(1);
     
      })
    });
    describe('Get bookmark by id',()=>{
      it('should get bookmark by id',()=>{
        return pactum.spec().getBookmarkById('/bookmarks/{id}').withPathParams('id','$S{bookmarkId}').withHeaders({Authorization:'Bearer $S{userAt}'}).expectStatus(200).expectBodyContains('$S{bookmarkId}');
     
      })
    });
    describe('Edit bookmark by id',()=>{
      const dto : EditBookmarkDto={
        title:'PrismaClientValidationError: Invalid prisma.user.create() invocation:',
        description:'I am trying to create an API using Next.js & Prisma. I have two model user & profile. I want to create user & also profile field from req.body using postman.'
      };
      it('should edit bookmark by id',()=>{
        return pactum.spec().Patch('/bookmarks/{id}').withPathParams('id','$S{bookmarkId}').withHeaders({Authorization:'Bearer $S{userAt}'}).withBody(dto).expectStatus(200).expectBodyContains(dto.title).expectBodyContains(dto.description).inspect();
     
      })
    });
    describe('Delete bookmark by id',()=>{
      it('should delete bookmark by id',()=>{
        return pactum.spec().delete('/bookmarks/{id}').withPathParams('id','$S{bookmarkId}').withHeaders({Authorization:'Bearer $S{userAt}'}).expectStatus(204).inspect();
     
      });
      it('should get empty bookmarks',()=>{
        return pactum.spec().get('/bookmarks').withHeaders({Authorization:'Bearer $S{userAt}'}).expectStatus(200).expectJsonLength(0);
     
      });
    });


  });
 it.todo('should pass');
});
