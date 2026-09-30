// Plantilla de src/environments/environment.ts (ese archivo está en .gitignore).
// `npm install` la copia automáticamente si environment.ts no existe.
export const environment = {
  production: false,
  // Consola de Firebase > Configuración del proyecto > Tus apps
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
};

// EmailJS (formulario de contacto del footer)
export const SERVICE_ID = '';
export const TEMPLATE_ID = '';
export const USER_ID = '';

// Site key de Google reCAPTCHA v2 (registro de pacientes y especialistas)
export const CAPTCHA = '';
