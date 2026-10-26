import { Module } from '@nestjs/common';
import { PersonnelController } from './personnel.controller';
import { MaSignatureController } from './ma-signature.controller';
import { PersonnelService } from './personnel.service';
import { SignatureService } from './signature.service';

@Module({
  controllers: [PersonnelController, MaSignatureController],
  providers: [PersonnelService, SignatureService],
})
export class PersonnelModule {}
