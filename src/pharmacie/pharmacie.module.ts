import { Module } from '@nestjs/common';
import { AccueilModule } from '../accueil/accueil.module';
import { ImpressionModule } from '../impression/impression.module';
import { PharmacieController } from './pharmacie.controller';
import { PharmacieService } from './pharmacie.service';
import { TachesSeuilsService } from './taches-seuils.service';

@Module({
  imports: [ImpressionModule, AccueilModule], // AccueilModule : patient express (ordonnance externe)
  controllers: [PharmacieController],
  providers: [PharmacieService, TachesSeuilsService],
  exports: [PharmacieService],
})
export class PharmacieModule {}
