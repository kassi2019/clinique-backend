import { Module } from '@nestjs/common';
import { LaboratoireController } from './laboratoire.controller';
import { LaboratoireService } from './laboratoire.service';

@Module({
  controllers: [LaboratoireController],
  providers: [LaboratoireService],
})
export class LaboratoireModule {}
