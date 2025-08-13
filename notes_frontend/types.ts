export type Tag = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export type Category = {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export type Note = {
  id: number
  title: string
  content?: string
  is_archived?: boolean
  category: number | null
  tags: number[]
  created_at?: string
  updated_at?: string
}

export type NotePayload = {
  title: string
  content?: string
  is_archived?: boolean
  category: number | null
  tags: number[]
}
