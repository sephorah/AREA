import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import axios from 'axios';
import constants from 'src/constants';
import { IsCheckTrue } from 'src/protos/interfaces';

@Controller()
export class CoinFlipTriggersController {
  constructor() {}

  @GrpcMethod('CoinFlipService', 'CheckHeads')
  async checkHeads(): Promise<IsCheckTrue> {
    const url = 'https://coin-flip1.p.rapidapi.com/headstails';

    try {
      const result = await axios.get(url, {
        headers: {
          'x-rapidapi-key': constants().apiKey,
        },
      });
      return { check: result.data.outcome == 'Heads' };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }

  @GrpcMethod('CoinFlipService', 'CheckTails')
  async checkTails(): Promise<IsCheckTrue> {
    const url = 'https://coin-flip1.p.rapidapi.com/headstails';

    try {
      const result = await axios.get(url, {
        headers: {
          'x-rapidapi-key': constants().apiKey,
        },
      });
      return { check: result.data.outcome == 'Tails' };
    } catch (error) {
      Logger.error(error);
      throw new RpcException(error);
    }
  }
}
