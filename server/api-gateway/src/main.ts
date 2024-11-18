import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:8081', 'http://localhost:8085', 'http://localhost:3000', 'http://10.0.2.2:8080'],
  });

  const options = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Here are all the endpoints you can call on the API Gateway of AREA')
    .setVersion('1.0')
    .addTag('Authentification')
    .addTag('User Management')
    .addTag('AREA')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('API-Documentation', app, document);


  await app.listen(8080);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
