import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodueRequest } from '../../requests/UpdateTodueRequest'
import { updateTodue } from '../../businessLogic/todues'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const todueId = event.pathParameters.todueId
  const updatedTodue: UpdateTodueRequest = JSON.parse(event.body)

  let statusCode: number

  let body: string
  try {
    await updateTodue(jwtToken, { todueId, ...updatedTodue })
    statusCode = 201
  } catch (error) {
    body = error
    statusCode = 404
  }

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  }
}
