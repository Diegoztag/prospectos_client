// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Leer README.md para generar variables de aplicación (línea 200 - 270)

export const environment = {
	appId: '', // Código individual la de la aplicación
	production: false,
	configFile: 'assets/settings/settings.json',
	authMechanisms: {
		// Variedad de mecanismos de autenticación disponibles
		azureAD: false,               // AAD (Etapa experimental, no oficializado)
		huella: false,               // SSO
		colaboradorDigital: false,   // SSO
		authcode: false,              // SSO
		custom: true                // custom
	},
	authSources: {
		// Variables sensibles para cada tipo de autenticación
		AAD: {
			tenantId: '', // Organización en Azure Active Directory
			clientId: '', // Código único en la instancia del tenant al que pertenece
			authorityUrl: 'https://login.microsoftonline.com',
			redirectUri: 'http://localhost:4200',
			graphUrl: 'https://graph.microsoft.com',
		},
		SSO: {
			apiUrl: 'https://sso.coppel.io:50061/api'
			// Deberá coincidir con la ruta en server.js
		},
		custom: {
			apiUrl: 'http://localhost:3200'
		}
	},
	authApproach: [
		// APIs y fuentes de datos que requieran recibir el token y headers
		'http://localhost:3200'
	]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
