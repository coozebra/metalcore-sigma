import Bugsnag from '@bugsnag/js';
import { logger } from './logger';

interface IOptions {
  context: string;
  metadata?;
  severity?: 'error' | 'info' | 'warning';
}

export const bugsnag = (error: string | Error, options: IOptions) => {
  Bugsnag.notify(
    typeof error === 'string' ? new Error(error) : error,
    event => {
      event.severity = options?.severity || 'error';
      event.context = options.context;

      if (options?.metadata) {
        event.addMetadata(options.context, options.metadata);
      }
    },
    (_, event) =>
      logger?.[event.severity]({
        msg: '[bugsnag]',
        context: event.context,
        metadata: JSON.stringify((event as any)?._metadata),
      }),
  );
};
