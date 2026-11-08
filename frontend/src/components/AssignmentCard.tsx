import { Link } from 'react-router'
import type { Assignment } from '../types/assignment'
import { difficultyLabels, statusLabels } from '../data/labels'

// название курса приходит готовым: карточка сама справочник не грузит
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