import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import router from './routes';

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cors());
expressApp.use(compression());
expressApp.use(helmet());
expressApp.disable('etag');

expressApp.use('/', router);

export default expressApp;
