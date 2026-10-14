export type AssignmentStatus = 'todo' | 'in_progress' | 'done'
export type AssignmentDifficulty = 'easy' | 'medium' | 'hard'

export type Assignment = {
  id: string
  title: string
  description: string
  course: string
  deadline: string
  status: AssignmentStatus
  difficulty: AssignmentDifficulty
}