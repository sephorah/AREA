import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GOOGLE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'google',
          protoPath: join(__dirname, '../protos/google.proto'),
          url: 'google-service:50051',
        },
      },
    ]),
  ],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
