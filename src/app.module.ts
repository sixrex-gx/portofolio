import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { ContactController } from './contact.controller';
import { publicRoot } from './public-root';
import { SeoController } from './seo.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: publicRoot,
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
        maxAge: '1h',
        fallthrough: true,
        setHeaders: (res, path) => {
          if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          } else if (path.includes('/assets/') || path.includes('/fonts/')) {
            res.setHeader(
              'Cache-Control',
              'public, max-age=31536000, immutable',
            );
          }
        },
      },
    }),
  ],
  controllers: [AppController, SeoController, ContactController],
})
export class AppModule {}
