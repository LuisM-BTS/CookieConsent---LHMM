import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as CookieConsent from 'vanilla-cookieconsent';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import * as QRCode from 'qrcode';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'cookie-consent-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css'],
})
export class CookieConsentComponent implements AfterViewInit {
  constructor(private http: HttpClient) { }

   @ViewChild('qrcode', { static: false }) qrCodeElement!: ElementRef;

  combinedData: any;
  ngAfterViewInit(): void {
    CookieConsent.run({
      onFirstConsent: ({ cookie }) => {
        console.log('onFirstConsent fired', cookie);
      },

      onConsent: ({ cookie }) => {
        console.log('onConsent fired!', cookie);
      },

      onChange: ({ changedCategories, changedServices }) => {
        console.log('onChange fired!', changedCategories, changedServices);
      },

      onModalReady: ({ modalName }) => {
        console.log('ready:', modalName);
      },

      onModalShow: ({ modalName }) => {
        console.log('visible:', modalName);
        console.log('Modal mostrado:', modalName);

        // Mostrar el modal cambiando el estilo a 'block'
        const modal = document.getElementById('btsModal');
        if (modal) {
          modal.style.display = 'block'; 
        }
        this.http.get('https://667c40b33c30891b865bee01.mockapi.io/api/v1/users').subscribe(data1 => {
            console.log('Datos del primer endpoint:', data1);

            // Llamada al segundo endpoint
            this.http.get('https://667c40b33c30891b865bee01.mockapi.io/api/v1/article').subscribe(data2 => {
              console.log('Datos del segundo endpoint:', data2);

              // Combinar los datos de ambos endpoints
              this.combinedData = { data1, data2 };

              // Generar el código QR con los datos combinados
              this.generateQRCode(JSON.stringify(this.combinedData));
            });
        });

        
      },

      


      onModalHide: ({ modalName }) => {
        console.log('hidden:', modalName);
      },

      categories: {
        necessary: {
          enabled: true, // this category is enabled by default
          readOnly: true, // this category cannot be disabled
        },
        analytics: {
          autoClear: {
            cookies: [
              {
                name: /^_ga/, // regex: match all cookies starting with '_ga'
              },
              {
                name: '_gid', // string: exact cookie name
              },
            ],
          },

          services: {
            ga: {
              label: 'Google Analytics (dummy)',
              onAccept: () => {},
              onReject: () => {},
            },
            youtube: {
              label: 'Youtube Embed (dummy)',
              onAccept: () => {},
              onReject: () => {},
            },
          },
        },
        ads: {},
      },

      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage Individual preferences',
              // closeIconLabel: 'Reject all and close modal',
              footer: `
                    <a href="#path-to-impressum.html" target="_blank">Impressum</a>
                    <a href="#path-to-privacy-policy.html" target="_blank">Privacy Policy</a>
                `,
            },
            preferencesModal: {
              title: 'Manage cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Accept current selection',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Your Privacy Choices',
                  description: `In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.`,
                },
                {
                  title: 'Strictly Necessary',
                  description:
                    'These cookies are essential for the proper functioning of the website and cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Performance and Analytics',
                  description:
                    'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                  linkedCategory: 'analytics',
                  cookieTable: {
                    caption: 'Cookie table',
                    headers: {
                      name: 'Cookie',
                      domain: 'Domain',
                      desc: 'Description',
                    },
                    body: [
                      {
                        name: '_ga',
                        domain: window.location.hostname,
                        desc: 'Description 1',
                      },
                      {
                        name: '_gid',
                        domain: window.location.hostname,
                        desc: 'Description 2',
                      },
                    ],
                  },
                },
                {
                  title: 'Targeting and Advertising',
                  description:
                    'These cookies are used to make advertising messages more relevant to you and your interests. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
                  linkedCategory: 'ads',
                },
                {
                  title: 'More information',
                  description:
                    'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>',
                },
              ],
            },
          },
        },
      },
    });
  }

 generateQRCode(data: any) {
  const compressedData = btoa(JSON.stringify(data)); // Comprime los datos
  QRCode.toCanvas(this.qrCodeElement.nativeElement, compressedData, { width: 200 }, function (error) {
    if (error) console.error(error);
    console.log('¡Código QR generado!');
  });
}

  closeBTSModal() {
      const modal = document.getElementById('btsModal');
      if (modal) {
        modal.style.display = 'none'; // Oculta el modal
      }
    }
}
