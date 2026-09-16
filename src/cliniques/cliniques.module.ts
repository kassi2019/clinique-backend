import { Module } from '@nestjs/common';
import { CliniquesController } from './cliniques.controller';
import { CliniquesService } from './cliniques.service';

@Module({
  controllers: [CliniquesController],
  providers: [CliniquesService],
})
export class CliniquesModule {}
