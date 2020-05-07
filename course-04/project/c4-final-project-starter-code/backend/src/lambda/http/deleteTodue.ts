import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodue } from '../../businessLogic/todues'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const todueId = event.pathParameters.todueId
  let statusCode, body = ''

  try {
    await deleteTodue(jwtToken, todueId)
    statusCode = 200
  } catch (error) {
    console.log(error)
    statusCode = 404
    body = error
  }

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body
  }
}
