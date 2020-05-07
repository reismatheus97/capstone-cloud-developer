import uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { TodueAccess } from '../dataLayer/todueAccess'

const todueAccess = new TodueAccess()

export async function getToduesPerUser (jwtToken: string): Promise<any[]> {
  const userId = getUserId(jwtToken)
  return todueAccess.getToduesPerUser(userId)
}

export async function getTodue (jwtToken: string, todueId: string): Promise<any[]> {
  const userId = getUserId(jwtToken)
  return todueAccess.getTodue(userId, todueId)
}

export async function createTodue (
  todueRequest,
  jwtToken
): Promise<any> {

  const todueId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await todueAccess.createTodue({
    todueId,
    userId,
    ...todueRequest
  })

}

export async function updateTodue (jwtToken: string, todue: object): Promise<any[]> {
  const userId = getUserId(jwtToken)
  return todueAccess.updateTodue(userId, todue)
}

export async function deleteTodue (jwtToken: string, todueId: string): Promise<any[]> {
  const userId = getUserId(jwtToken)
  return todueAccess.deleteTodue(userId, todueId)
}

export async function generateUploadUrl (jwtToken: string, todueId: string): Promise<string> {
  const userId = getUserId(jwtToken)
  return todueAccess.getUploadUrl(userId, todueId)
}
