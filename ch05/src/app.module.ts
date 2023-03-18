import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule], // CommonModule 삭제
  controllers: [AppController], // CommmonController 삭제
  providers: [AppService], // CommonService 삭제
})
export class AppModule {}
