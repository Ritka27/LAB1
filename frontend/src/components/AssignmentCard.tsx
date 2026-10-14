import { Link } from 'react-router'
import type { Assignment } from '../types/assignment'
import { difficultyLabels, statusLabels } from '../data/labels'

type AssignmentCardProps = { assignment: Assignment }

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <article className="assignment-card">
      <h2>
        <Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link>
      </h2>
      <p>{assignment.description}</p>
      <p>Курс: {assignment.course}</p>
      <p>Дедлайн: {assignment.deadline}</p>
      <p>
        Статус: {statusLabels[assignment.status]} · Сложность:{' '}
        {difficultyLabels[assignment.difficulty]}
      </p>
    </article>
  )
}