import { config } from 'dotenv-flow';
import { install } from 'source-map-support';
import Server from './server';

install();
config();

new Server().start();
