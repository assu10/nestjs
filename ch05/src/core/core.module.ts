import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';

// CommonModule 을 가져온 후 다시 내보냄
@Module({ imports: [CommonModule], exports: [CommonModule] })
export class CoreModule {}
