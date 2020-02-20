import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        allowedHeaders: ['Content-Type', 'Authorization', 'x-redmine-api-host', 'x-redmine-api-key'],
        credentials: true,
        optionsSuccessStatus: 200
    });
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    }));
    await app.listen(process.env.PORT || 5000);
}

// noinspection JSIgnoredPromiseFromCall
bootstrap();
