import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'
import { decode } from "jsonwebtoken";

/**
 * Get a jwt token string
 * @param jwtToken jwt token string
 *
 * @returns a user id from a JWT token
 */
export function getUserId(jwtToken) {
  const decodedJwt = decode(jwtToken)
  return decodedJwt.sub
}

/* initialize the JWKS client */
const auth0Domain = process.env.AUTH_0_DOMAIN
const auth0Audience = process.env.AUTH_0_AUDIENCE
const auth0Issuer = process.env.AUTH_0_ISSUER

const authClient = jwksClient({
  cache: true,
  jwksUri: `${auth0Domain}/.well-known/jwks.json`,
  audience: auth0Audience,
  issuer: auth0Issuer,
})

/* Check authorization JWT */
export function checkAuth(event) {
  const alg = 'RS256'
  return new Promise((resolve, reject) => {
    console.log('event.headers', event.headers)

    // Handler auth headers AND aws custom authorizers
    const authHeader = event.authorizationToken
    console.log('authHeader >>', authHeader)

    // remove "bearer " word from token
    const authToken = authHeader.substring(7)

    // Validate Token is not malformed. AKA fail fast
    let decodedToken
    try {
      decodedToken = jwt.decode(authToken, { complete: true })
    } catch (err) {
      console.log(err)
      return reject(new Error('JWT token is malformed'))
    }

    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      return reject(new Error('JWT token is malformed'))
    }
    console.log("decodedToken >>", decodedToken)
    const kid = decodedToken.header.kid

    // Get Signing key from auth0
    authClient.getSigningKey(kid, (signError, key) => {
      if (signError) {
        console.log('signing key error', signError)
        return reject(new Error('signing key error'))
      }

      const signingKey = key.publicKey || key.rsaPublicKey
      const opts = { algorithms: [alg] }

      // Now Verify the jwt token is valid
      try {
        jwt.verify(authToken, signingKey, opts, (verifyError, decoded) => {
          if (verifyError) {
            console.log('Token signature NOT VERIFIED', verifyError)
            return reject(new Error('Token signature NOT VERIFIED'))
          }
          // output for logs
          console.log('------------------')
          console.log('decoded jwt token')
          console.log(decoded)
          console.log('------------------')

          // Everything is ok!
          return resolve(decoded)
        })
      } catch (err) {
        console.log('jwt.verify exception', err)
        return reject(err)
      }
    })
  })
}