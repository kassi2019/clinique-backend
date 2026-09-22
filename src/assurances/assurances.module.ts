import { Module } from '@nestjs/common';
import { AssurancesController } from './assurances.controller';
import { AssurancesService } from './assurances.service';

@Module({
  controllers: [AssurancesController],
  providers: [AssurancesService],
  exports: [AssurancesService],
})
export class AssurancesModule {}
