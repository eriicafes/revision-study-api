import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './core/services/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validate route input
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  // transform response entity
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)

  await app.listen(3000);
}
bootstrap();
