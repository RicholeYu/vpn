import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
console.log(join(__dirname, '../../', 'go/dist'))

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'go/dist'),
      serveRoot: '/go'
    })
  ],
  controllers: [AppController],
})
export class AppModule {}
