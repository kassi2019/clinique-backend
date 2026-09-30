import { Module } from '@nestjs/common';
import { ImpressionModule } from '../impression/impression.module';
import { AccueilController } from './accueil.controller';
import { AccueilService } from './accueil.service';

@Module({
  imports: [ImpressionModule],
  controllers: [AccueilController],
  providers: [AccueilService],
  exports: [AccueilService], // réutilisé par la maternité (accouchement en urgence)
})
export class AccueilModule {}
