import { Link } from 'react-router'
import type { Assignment } from '../types/assignment'
import { difficultyLabels, statusLabels } from '../data/labels'

// НОВОЕ: карточка получает не только задание, но и готовое название курса.
// Сама она справочник не грузит: иначе было бы пять запросов вместо одного.
type AssignmentCardProps = {
  assignment: Assignment
  courseName: string
}

export function AssignmentCard({ assignment, courseName }: AssignmentCardProps) {
  return (
    <article className="assignment-card">
      <h2>
        <Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link>
      </h2>
      <p>{assignment.description}</p>
      <p>Курс: {courseName}</p>
      <p>Дедлайн: {assignment.deadline}</p>
      <p>
        Статус: {statusLabels[assignment.status]} · Сложность:{' '}
        {difficultyLabels[assignment.difficulty]}
      </p>
    </article>
  )
}