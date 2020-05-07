/**
 * Fields in a request to update a single Todue item.
 */
export interface UpdateTodueRequest {
  name: string
  dueDate: string
  done: boolean
}