import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AccessToken, LoginProviderParams } from './protos/interfaces';
import { lastValueFrom, Observable } from 'rxjs';

interface UserManagementService {
  LoginWithProvider(data: LoginProviderParams): Observable<AccessToken>;
}

@Injectable()
export class AppService implements OnModuleInit {
  private userManagementService: UserManagementService;

  constructor(
    @Inject('USER_MANAGEMENT_PACKAGE') private userManagementClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userManagementService =
      this.userManagementClient.getService<UserManagementService>(
        'UserManagementService',
      );
  }

  async loginWithProvider(data: LoginProviderParams): Promise<AccessToken> {
    Logger.debug('IN LOGIN WITH PROVIDER OF GOOGLE');
    return await lastValueFrom(
      this.userManagementService.LoginWithProvider(data),
    );
  }
}
