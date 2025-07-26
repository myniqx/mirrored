export interface User {
  id: string
  name: string
  email: string
  photoURL?: string
  bookmarks: Bookmark[]
}

export interface Bookmark {
  id: string
  name: string
  createdAt: Date
  lastReadAt: Date
  page: number
}
