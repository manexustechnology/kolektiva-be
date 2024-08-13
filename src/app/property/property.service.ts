import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property-body.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpdatePropertyDto } from './dto/update-property-body.dto';

@Injectable()
export class PropertyService {
    constructor(private prisma: PrismaService) {}

    async create(createPropertyDto: CreatePropertyDto) {
      const { facilities, images, ...propertyData } = createPropertyDto;
  
      return this.prisma.property.create({
        data: {
          ...propertyData,
          facilities: {
            create: facilities,
          },
          images: {
            create: images,
          },
        },
        include: {
          facilities: true,
          images: true,
        },
      });
    }
  
    async findAll() {
      return this.prisma.property.findMany({
        include: {
          facilities: true,
          images: true,
        },
      });
    }
  
    async findOne(id: string) {
      return this.prisma.property.findUnique({
        where: { id },
        include: {
          facilities: true,
          images: true,
        },
      });
    }
  
    async update(id: string, updatePropertyDto: UpdatePropertyDto) {
      const { facilities, images, ...propertyData } = updatePropertyDto;
  
      return this.prisma.property.update({
        where: { id },
        data: {
          ...propertyData,
          facilities: {
            deleteMany: {},
            create: facilities,
          },
          images: {
            deleteMany: {},
            create: images,
          },
        },
        include: {
          facilities: true,
          images: true,
        },
      });
    }
  
    async remove(id: string) {
      return this.prisma.property.delete({
        where: { id },
        include: {
          facilities: true,
          images: true,
        },
      });
    }
}
