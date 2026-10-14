import { Module } from '@nestjs/common';
import { FinancesController } from './finances.controller';
import { FinancesGuard } from './finances.guard';
import { FinancesService } from './finances.service';

@Module({
  controllers: [FinancesController],
  providers: [FinancesService, FinancesGuard],
})
export class FinancesModule {}
