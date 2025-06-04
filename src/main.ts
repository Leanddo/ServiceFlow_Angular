import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

// Regista o locale
registerLocaleData(localePt, 'pt-PT');

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

  