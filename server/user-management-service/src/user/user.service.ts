import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import prisma from '../client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async createUser(data: Omit<User, 'id'>): Promise<User> {
    return await prisma.user.create({ data: { id: randomUUID(), ...data } });
  }

  async getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async getUser(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByName(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async getUserByProvider(
    username: string,
    email: string,
    provider: string,
  ): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        username: username,
        email: email,
        provider: provider,
      },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: {
        id,
      },
      data: data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
