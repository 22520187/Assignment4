import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MailOutline, EyeOutline, EyeInvisibleOutline, LockOutline } from '@ant-design/icons-angular/icons';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: NzIconModule, useValue: [MailOutline, EyeOutline, EyeInvisibleOutline, LockOutline] }
  ]
};
