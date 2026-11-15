import { Module } from '@nestjs/common';
import { UtilisateursController } from './utilisateurs.controller';
import { UtilisateursOptionsController } from './utilisateurs-options.controller';
import { UtilisateursService } from './utilisateurs.service';

@Module({
  controllers: [UtilisateursController, UtilisateursOptionsController],
  providers: [UtilisateursService],
})
export class UtilisateursModule {}
