import type {
  AssignmentDifficulty,
  AssignmentStatus,
} from '../types/assignment'

export const statusLabels: Record<AssignmentStatus, string> = {
  todo: 'К выполнению',
  in_progress: 'В работе',
  done: 'Выполнено',
}

export const difficultyLabels: Record<AssignmentDifficulty, string> = {
  easy: 'Лёгкое',
  medium: 'Среднее',
  hard: 'Сложное',
}