/*
    OpenQuizzer  © 2025 by Carla Bravo Maestre is licensed under CC BY 4.0.
    To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
*/
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
