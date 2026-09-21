import { Module } from '@nestjs/common';
import { AffectationModule } from '../affectation/affectation.module';
import { ImpressionModule } from '../impression/impression.module';
import { CaisseController } from './caisse.controller';
import { CaisseService } from './caisse.service';

@Module({
  imports: [ImpressionModule, AffectationModule],
  controllers: [CaisseController],
  providers: [CaisseService],
})
export class CaisseModule {}
