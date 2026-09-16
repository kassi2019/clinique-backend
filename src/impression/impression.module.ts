import { Module } from '@nestjs/common';
import { ImpressionController } from './impression.controller';
import { ImpressionService } from './impression.service';

@Module({
  controllers: [ImpressionController],
  providers: [ImpressionService],
  exports: [ImpressionService],
})
export class ImpressionModule {}
