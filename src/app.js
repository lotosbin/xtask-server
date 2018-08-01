import express from 'express';
import graphQLHTTP from 'express-graphql';
import bodyParser from "body-parser";
import schema from './schema/index';
import {isDevelopment, isProduction} from './utils';
import cors from "cors";
import loaders from './loaders'
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (isDevelopment()) {
    app.use(cors({
        allowedHeaders: ['Content-Type', 'Authorization', 'x-redmine-api-host', 'x-redmine-api-key'],
        credentials: true,
        optionsSuccessStatus: 200
    }));
}


app.use(graphQLHTTP(async (req) => {
    return {
        context: { loaders, request: req },
        schema,
        graphiql: true,
    };
}
));

let port = 5000;
app.listen(port, () => {
    console.log(`NODE_ENV=${isProduction() ? "production" : "development"}`);
    return console.log(`listen on http://localhost:${port}`);
});