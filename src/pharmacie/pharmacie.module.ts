import { Module } from '@nestjs/common';
import { ImpressionModule } from '../impression/impression.module';
import { PharmacieController } from './pharmacie.controller';
import { PharmacieService } from './pharmacie.service';

@Module({
  imports: [ImpressionModule],
  controllers: [PharmacieController],
  providers: [PharmacieService],
})
export class PharmacieModule {}
