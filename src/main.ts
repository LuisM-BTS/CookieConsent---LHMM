import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { CookieConsentComponent } from './components/cookieconsent/cookie-consent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CookieConsentComponent],
  templateUrl: './main.html',
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
