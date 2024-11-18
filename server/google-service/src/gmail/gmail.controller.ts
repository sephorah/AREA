import { Controller, Inject, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { SendEmailParams, SendEmailToYourselfParams } from '../protos/interfaces';
import axios from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('')
export class GmailController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // @GrpcMethod('GoogleService', 'RequestAccessGmail')
  // requestAccessGmail(): RequestAuthSent {
  //   const clientId = constants().googleClientId;
  //   const redirectUri = constants().redirectUri;
  //   const scope = 'https://www.googleapis.com/auth/gmail.send';
  //   const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  //   return { url: url };
  // }

  @GrpcMethod('GoogleService', 'SendEmail')
  async sendEmail({ recipient, subject, body }: SendEmailParams) {
    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
    const requestBody = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
    const accessToken = await this.cacheManager.get('googleToken');

    if (!accessToken) {
      Logger.log('Undefined access token for Google');
      return;
    }
    if (!subject || !body) {
      throw new RpcException('Invalid arguments for sending email to yourself');
    }
    try {
      await axios.post(
        url,
        {
          raw: Buffer.from(requestBody)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('GoogleService', 'SendEmailToYourself')
  async sendEmailToYourself({ subject, body }: SendEmailToYourselfParams) {
    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
    const getEmailUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const accessToken = await this.cacheManager.get('googleToken');

    if (!accessToken) {
      Logger.log('Undefined access token for Google');
      return;
    }
    if (!subject || !body) {
      throw new RpcException('Invalid arguments for sending email to yourself');
    }
    try {
      Logger.debug('THERE INNIT', accessToken);
      const emailUser = (
        await axios.get(getEmailUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.email;
      const requestBody = `To: ${emailUser}\nSubject: ${subject}\n\n${body}`;
      Logger.debug('REQUEST BODY ', requestBody);
      await axios.post(
        url,
        {
          raw: Buffer.from(requestBody)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}
