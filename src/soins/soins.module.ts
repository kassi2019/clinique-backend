import { Module } from '@nestjs/common';
import { SoinsController } from './soins.controller';
import { SoinsService } from './soins.service';

@Module({
  controllers: [SoinsController],
  providers: [SoinsService],
  exports: [SoinsService],
})
export class SoinsModule {}
