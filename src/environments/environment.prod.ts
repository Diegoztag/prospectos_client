export const environment = {
  appId: '',
  production: true,
  configFile: 'assets/settings/settings.prod.json',
  authMechanisms: {
    azureAD: true,
    huella: false,
    colaboradorDigital: false,
    authcode: true,
    custom: false
  },
  authSources: {
    AAD: {
      tenantId: '',
      clientId: '',
      authorityUrl: 'https://login.microsoftonline.com',
      redirectUri: 'http://localhost:4200',
      graphUrl: 'https://graph.microsoft.com',
    },
    SSO: {
      apiUrl: 'https://sso.coppel.io:50061/api'
    },
    custom: {
      apiUrl: 'http://localhost:3200'
    }
  },
  authApproach: [
    'http://localhost:3200'
  ]
};