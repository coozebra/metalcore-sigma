import next from 'next';
import express from 'express';
import cookieParser from 'cookie-parser';
import Bugsnag from '@bugsnag/js';
import getConfig from 'next/config';
import requestIp from 'request-ip';
import BugsnagPluginExpress from '@bugsnag/plugin-express';

import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import { BotController } from './controllers/BotController';
import { GeofenceController } from './controllers/GeofenceController';
import { HealthController } from './controllers/HealthController';
import { LeaderboardController } from './controllers/LeaderboardController';
import { UsersController } from './controllers/UsersController';
import { VersionController } from './controllers/VersionController';
import { WhitelistController } from './controllers/WhitelistController';

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const { publicRuntimeConfig } = getConfig();

  Bugsnag.start({
    apiKey: publicRuntimeConfig.BUGSNAG_API_KEY as string,
    appType: 'server',
    appVersion: publicRuntimeConfig.APP_VERSION as string,
    plugins: [BugsnagPluginExpress],
    releaseStage: publicRuntimeConfig.RELEASE_ENV as string,
    logger,
  });

  const server = express();

  // TODO: add helmet

  server
    .use(express.json(), cookieParser())
    .use('/health', new HealthController().router)
    .use('/version', new VersionController().router)
    .use('/api/v1/bot', new BotController().router)
    .use('/api/v1/geofence', requestIp.mw(), new GeofenceController().router)
    .use('/api/v1/leaderboard', new LeaderboardController().router)
    .use('/api/v1/users', new UsersController().router)
    .use('/api/v1/whitelist', new WhitelistController().router)
    .use(errorHandler);

  // TODO: need to handle errors at the end
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    logger.info(`> listening on ${PORT}`);
  });
});
