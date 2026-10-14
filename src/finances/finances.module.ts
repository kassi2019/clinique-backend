import { Module } from '@nestjs/common';
import { AffectationModule } from '../affectation/affectation.module';
import { FinancesController } from './finances.controller';
import { FinancesGuard } from './finances.guard';
import { FinancesService } from './finances.service';

@Module({
  imports: [AffectationModule],
  controllers: [FinancesController],
  providers: [FinancesService, FinancesGuard],
})
export class FinancesModule {}
