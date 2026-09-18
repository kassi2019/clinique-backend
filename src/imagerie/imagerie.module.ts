import { Module } from '@nestjs/common';
import { ImagerieController } from './imagerie.controller';
import { ImagerieService } from './imagerie.service';

@Module({
  controllers: [ImagerieController],
  providers: [ImagerieService],
})
export class ImagerieModule {}
