import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from '../app.service';
import { AccessToken } from 'src/protos/interfaces';
import { LoginDto, RegisterDto } from './user-managament.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('User Management')
export class UserManagementController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register to AREA' })
  @ApiResponse({
    status: 400,
    description:
      "Email must be as an email format: example@service.com | Password's lenght must be 8 mininmum and 12 maximum | Password must match confirmPassword",
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  register(@Body() registerDto: RegisterDto): AccessToken {
    return this.appService.register(registerDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login to AREA' })
  @ApiResponse({
    status: 400,
    description: "Password's lenght must be 8 minimum 12 maximum",
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto): AccessToken {
    Logger.debug('LOGIN DTO', JSON.stringify(loginDto));
    return this.appService.login(loginDto);
  }

  @Get('/user/:id/info')
  getUserInfo(@Param() params: any) {
    return this.appService.getUserInfo({
      userId: params.id,
    });
  }

  @Post('/logout')
  logout() {
    return this.appService.logout();
  }

  @Get('/user/deleteUser/:id')
  async deleteUser(@Param() params: any) {
    return await this.appService.deleteUser({
      userId: params.id
    })
  }
}
