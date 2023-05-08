import { Component } from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import getConfig from 'next/config';

import { ErrorFallback } from 'shared/components/ErrorFallback';

export class BugsnagProvider extends Component<{ children: any }, { hasError: boolean }> {
  constructor(props: { children: any }) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * NOTE: copied from bugsnag internal error boundary
   * https://github.com/bugsnag/bugsnag-js/blob/next/packages/plugin-react/src/index.js
   */
  formatComponentStack(str) {
    const lines = str.split(/\s*\n\s*/g);

    let ret = '';

    for (let line = 0, len = lines.length; line < len; line++) {
      if (lines[line].length) {
        ret += `${ret.length ? '\n' : ''}${lines[line]}`;
      }
    }

    return ret;
  }

  // NOTE: send bugsnag a custom error boundary event
  notify(error, info) {
    try {
      const event = Bugsnag.Event.create(
        error,
        true,
        {
          severity: 'error',
          unhandled: true,
          severityReason: { type: 'unhandledException' },
        },
        info.componentStack,
        0,
      );

      if (info && info.componentStack) {
        info.componentStack = this.formatComponentStack(info.componentStack);
      }

      event.addMetadata('react', info);

      Bugsnag.notify(event?.originalError || new Error('ErrorBoundary'));
    } catch (_error: any) {
      /**
       * NOTE: if for some reason our custom error fails fallback to generic
       * bugsnag method but also trigger a warning to check out react integration
       */
      Bugsnag.notify(error);

      Bugsnag.notify(_error, report => {
        report.severity = 'warning';
      });
    }
  }

  componentDidCatch(error, info) {
    Bugsnag.leaveBreadcrumb('BugsnagProviderErrorBoundary', {
      name: error?.name,
      message: error?.message,
      fallback: 'ErrorFallback',
    });

    this.notify(error, info);
  }

  componentDidMount() {
    const { publicRuntimeConfig } = getConfig();

    Bugsnag.start({
      apiKey: publicRuntimeConfig.BUGSNAG_API_KEY as string,
      appVersion: publicRuntimeConfig.APP_VERSION as string,
      plugins: [new BugsnagPluginReact()],
      releaseStage: (publicRuntimeConfig.RELEASE_ENV as string) || 'development',
      appType: 'client',
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
