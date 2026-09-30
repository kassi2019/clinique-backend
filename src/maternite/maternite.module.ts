import { Module } from '@nestjs/common';
import { AccueilModule } from '../accueil/accueil.module';
import { MaterniteController } from './maternite.controller';
import { MaterniteService } from './maternite.service';

@Module({
  imports: [AccueilModule], // accouchement en urgence : création de passage sans paiement
  controllers: [MaterniteController],
  providers: [MaterniteService],
  exports: [MaterniteService],
})
export class MaterniteModule {}
