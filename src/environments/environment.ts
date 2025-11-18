// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	appStoragePrefix: 'COMISION_DEV_',
	longNameSystem: 'COMISION',
	shortNameSystem: 'ITP - COMISION - OGTI',
	// urlBackend: 'http://localhost:5041',
	urlBackend: 'https://localhost:7125',
	siteKeyCaptcha: "6Ldp8_spAAAAAP3ztV39YBUbWJ7MposM1RFLhVi2",
	tamanioArchivoMB: 10,
  	urlSso: "https://sso-dev.itp.gob.pe:8080/",
	realm: "itp",
    clientId: "app-comision-dev",
};
//npm run build-dev
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
