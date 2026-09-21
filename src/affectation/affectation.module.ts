import { Module } from '@nestjs/common';
import { AffectationService } from './affectation.service';

@Module({
  providers: [AffectationService],
  exports: [AffectationService],
})
export class AffectationModule {}
