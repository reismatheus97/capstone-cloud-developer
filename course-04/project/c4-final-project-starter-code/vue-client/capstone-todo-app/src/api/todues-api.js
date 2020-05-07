import { apiEndpoint } from '../config'
import Axios from 'axios'

export async function getTodues(idToken) {
  console.log('Fetching todues')

  const response = await Axios.get(`${apiEndpoint}/todues`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todues:', response.data)
  return response.data.items
}

export async function createTodue(idToken, newTodue) {
  const response = await Axios.post(`${apiEndpoint}/todues`, JSON.stringify(newTodue), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTodue(idToken, updatedTodue) {
  await Axios.patch(`${apiEndpoint}/todues/${updatedTodue.todueId}`, JSON.stringify(updatedTodue), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodue(idToken, todueId) {
  await Axios.delete(`${apiEndpoint}/todues/${todueId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(idToken, todueId) {
  const response = await Axios.post(`${apiEndpoint}/todues/${todueId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await Axios.put(uploadUrl, file)
}
