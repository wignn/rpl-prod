import { Module } from '@nestjs/common';
import { RoomtypeService } from './roomtype.service';
import { RoomtypeController } from './roomtype.controller';

@Module({
  providers: [RoomtypeService],
  controllers: [RoomtypeController]
})
export class RoomtypeModule {}
