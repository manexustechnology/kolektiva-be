import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property-body.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { UpdatePropertyDto } from './dto/update-property-body.dto';
import { ListPropertyQueryDto } from './dto/list-property-query.dto';

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

    async findAll(request: ListPropertyQueryDto) {
      const { sort, location, propertyType } = request;
  
      const whereClause: any = {};
  
      if (location && location !== 'All') {
        whereClause.OR = [
          { state: location },
          { city: location },
        ];
      }
  
      if (propertyType && propertyType !== 'All') {
        whereClause.type = propertyType;
      }
  
      const orderByClause: any[] = [];
  
      if (sort === 'Featured') {
        orderByClause.push({ isFeatured: 'desc' });
      } else if (sort === 'Newest') {
        orderByClause.push({ createdAt: 'desc' });
      } else if (sort === 'Oldest') {
        orderByClause.push({ createdAt: 'asc' });
      }
  
      return this.prisma.property.findMany({
        where: whereClause,
        orderBy: orderByClause,
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
