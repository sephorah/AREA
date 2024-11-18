import { Area } from '@prisma/client';
import { randomUUID } from 'crypto';
import prisma from '../client';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AreasService {
  constructor(private eventEmitter: EventEmitter2) {}

  async createArea(data: Omit<Area, 'id'>): Promise<Area> {
    return await prisma.area.create({ data: { id: randomUUID(), ...data } });
  }

  async getAreas(): Promise<Area[]> {
    return await prisma.area.findMany();
  }

  async getAreasByOwner(ownerId: string): Promise<Area[]> {
    return await prisma.area.findMany({
      where: {
        ownerId,
      },
    });
  }

  async getArea(id: string): Promise<Area | null> {
    return await prisma.area.findUnique({
      where: {
        id,
      },
    });
  }

  async updateArea(id: string, data: Partial<Area>): Promise<Area> {
    return await prisma.area.update({
      where: {
        id,
      },
      data: data,
    });
  }

  async deleteArea(id: string): Promise<Area> {
    return await prisma.area.delete({
      where: {
        id: id,
      },
    });
  }
}
