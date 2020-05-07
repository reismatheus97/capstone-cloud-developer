
// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ae3gx0jmhh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'reis-matheus.auth0.com',                      // Auth0 domain
  clientId: '4xCu056NL1Mb16QGoUS5AzT0xl6s63DK',          // Auth0 client id
  callbackUrl: 'http://localhost:8080/callback',
  audience:"https://reis-matheus.auth0.com/api/v2/"
}
