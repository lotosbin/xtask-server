import express from 'express';
import graphQLHTTP from 'express-graphql';
import bodyParser from "body-parser";
import schema from './schema/index';
import { isDevelopment, isProduction } from './utils';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (isDevelopment()) {
    app.use(cors());
}


app.use(graphQLHTTP(async (req) => {
    const loaders = {
    };
    return {
        context: { loaders, request: req },
        schema,
        graphiql: true,
    };
}
));

app.listen(5000, () => {
    console.log(`NODE_ENV=${isProduction() ? "production" : "development"}`);
    return console.log('listen on http://localhost:5000');
});