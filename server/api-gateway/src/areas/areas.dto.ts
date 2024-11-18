import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  reaction: string;

  @IsJSON()
  actionParams: string;

  @IsJSON()
  reactionParams: string;
}
