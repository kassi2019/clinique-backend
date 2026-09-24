import { Module } from '@nestjs/common';
import { MaterniteController } from './maternite.controller';
import { MaterniteService } from './maternite.service';

@Module({
  controllers: [MaterniteController],
  providers: [MaterniteService],
  exports: [MaterniteService],
})
export class MaterniteModule {}
