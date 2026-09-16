import { Module } from '@nestjs/common';
import { ImpressionModule } from '../impression/impression.module';
import { AccueilController } from './accueil.controller';
import { AccueilService } from './accueil.service';

@Module({
  imports: [ImpressionModule],
  controllers: [AccueilController],
  providers: [AccueilService],
})
export class AccueilModule {}
