import { Module } from '@nestjs/common';
import { ListesParametresController } from './listes-parametres.controller';
import { ListesParametresService } from './listes-parametres.service';
import { ParametresListesController } from './parametres-listes.controller';

@Module({
  controllers: [ListesParametresController, ParametresListesController],
  providers: [ListesParametresService],
  exports: [ListesParametresService],
})
export class ListesParametresModule {}
