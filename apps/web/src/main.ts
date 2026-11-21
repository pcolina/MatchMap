import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { mockEnabled } from './app/core/mocks/mock-flag';

const mocksReady = mockEnabled ? import('./app/core/mocks/mock-install').then((module) => module.installMocks()) : Promise.resolve();

mocksReady
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
