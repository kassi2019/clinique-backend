import { Module } from '@nestjs/common';
import { ImpressionModule } from '../impression/impression.module';
import { CaisseController } from './caisse.controller';
import { CaisseService } from './caisse.service';

@Module({
  imports: [ImpressionModule],
  controllers: [CaisseController],
  providers: [CaisseService],
})
export class CaisseModule {}
