import { Controller, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { User } from '@prisma/client';
import constants from 'src/constants';
import {
  AccessToken,
  LoginParams,
  LoginProviderParams,
  RegisterParams,
  UserId,
  UserInfo,
} from 'src/protos/interfaces';
import { compareSync, hashSync } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppService } from 'src/app.service';

@Controller('')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  saltRounds = constants().saltRounds;
  secretJwt = constants().secret;

  @GrpcMethod('UserManagementService', 'Register')
  async register({
    email,
    username,
    password,
  }: RegisterParams): Promise<AccessToken> {
    const user: Omit<User, 'id'> = {
      email: email,
      username: username,
      password: hashSync(password, this.saltRounds),
      provider: null,
      pictureUrl: null,
    };

    try {
      const alreadyRegistered = await this.userService.getUserByName(username);

      if (alreadyRegistered) {
        throw new RpcException('Username already used');
      } else {
        const createdUser = await this.userService.createUser(user);
        const accessToken = this.jwtService.sign({ username: user.username });
        const response = {
          accessToken: accessToken,
          userId: createdUser.id,
        };
        await this.cacheManager.set('currentUser', createdUser.id);
        return response;
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('UserManagementService', 'Login')
  async login({ username, password }: LoginParams): Promise<AccessToken> {
    try {
      const retrievedUser = await this.userService.getUserByName(username);
      if (!retrievedUser || !retrievedUser.password) {
        throw new RpcException('User not found');
      }
      const matchPassword = compareSync(password, retrievedUser.password);
      if (!matchPassword) {
        throw new RpcException('Wrong password');
      }
      const accessToken = this.jwtService.sign({ username: username });
      const response = {
        accessToken: accessToken,
        userId: retrievedUser.id,
      };
      await this.cacheManager.set('currentUser', retrievedUser.id);
      return response;
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('UserManagementService', 'LoginWithProvider')
  async loginWithProvider({
    username,
    email,
    provider,
  }: LoginProviderParams): Promise<AccessToken> {
    try {
      const retrievedUser = await this.userService.getUserByProvider(
        username,
        email,
        provider,
      );
      Logger.debug('HEYY LOGIN PROVIDER IN USER MANAGE');
      if (!retrievedUser) {
        Logger.debug('Creating a user for provider ', provider);
        const user: Omit<User, 'id'> = {
          email: email,
          username: username,
          password: null,
          provider: provider,
          pictureUrl: null,
        };
        const createdUser = await this.userService.createUser(user);
        const accessToken = this.jwtService.sign({ username: user.username });
        const response = {
          accessToken: accessToken,
          userId: createdUser.id,
        };
        await this.cacheManager.set('currentUser', createdUser.id);
        return response;
      } else {
        Logger.debug('RETRIEVDE USER');
        const accessToken = this.jwtService.sign({ username: username });
        const response = {
          accessToken: accessToken,
          userId: retrievedUser.id,
        };
        await this.cacheManager.set('currentUser', retrievedUser.id);
        return response;
      }
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('UserManagementService', 'GetUserInfo')
  async getUserInfo(data: UserId): Promise<UserInfo> {
    try {
      const retrievedUser = await this.userService.getUser(data.userId);

      return {
        email: retrievedUser.email,
        username: retrievedUser.username,
        password: retrievedUser.password ? retrievedUser.password : '',
        provider: retrievedUser.provider ? retrievedUser.provider : '',
        pictureURL: retrievedUser.pictureUrl ? retrievedUser.pictureUrl : '',
      };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('UserManagementService', 'DeleteUser')
  async deleteUser(data: UserId) {
    return await this.userService.deleteUser(data.userId);
  }

  @GrpcMethod('UserManagementService', 'Logout')
  async logout(): Promise<void> {
    try {
      this.cacheManager.del('currentUser');
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}
