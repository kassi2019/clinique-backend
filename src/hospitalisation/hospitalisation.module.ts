import { Module } from '@nestjs/common';
import { HospitalisationController } from './hospitalisation.controller';
import { HospitalisationService } from './hospitalisation.service';

@Module({
  controllers: [HospitalisationController],
  providers: [HospitalisationService],
})
export class HospitalisationModule {}
