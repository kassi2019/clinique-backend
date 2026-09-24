import { Module } from '@nestjs/common';
import { ImpressionModule } from '../impression/impression.module';
import { PharmacieController } from './pharmacie.controller';
import { PharmacieService } from './pharmacie.service';
import { TachesSeuilsService } from './taches-seuils.service';

@Module({
  imports: [ImpressionModule],
  controllers: [PharmacieController],
  providers: [PharmacieService, TachesSeuilsService],
  exports: [PharmacieService],
})
export class PharmacieModule {}
