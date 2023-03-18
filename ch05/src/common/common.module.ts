import { Module } from '@nestjs/common';
import { CommonService } from './common.service';

@Module({
  providers: [CommonService],
  exports: [CommonService], // CommonService 제공
})
export class CommonModule {}
