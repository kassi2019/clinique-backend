import { Module } from '@nestjs/common';
import { MedicamentsController } from './medicaments.controller';

@Module({
  controllers: [MedicamentsController],
})
export class MedicamentsModule {}
