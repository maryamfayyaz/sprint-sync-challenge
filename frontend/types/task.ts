export interface Task {
  id: number
  title: string
  description: string
  status: "TODO" | "IN_PROGRESS" | "DONE"
  totalMinutes?: number
  userId?: number
  assignedUser?: {
    id: number
    email: string
    name?: string
  }
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  inProgressAt?: string
}
