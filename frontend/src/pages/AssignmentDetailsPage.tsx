import { Link, useParams } from 'react-router'
import { assignments } from '../data/assignments'
import { difficultyLabels, statusLabels } from '../data/labels'

export function AssignmentDetailsPage() {
  const { id } = useParams()
  const assignment = assignments.find((item) => item.id === id)

  if (!assignment) {
    return (
      <section>
        <h1>Задание не найдено</h1>
        <p>Задания с таким номером нет в списке.</p>
        <Link to="/assignments">К списку заданий</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>{assignment.title}</h1>
      <p>{assignment.description}</p>
      <p>Курс: {assignment.course}</p>
      <p>Дедлайн: {assignment.deadline}</p>
      <p>Статус: {statusLabels[assignment.status]}</p>
      <p>Сложность: {difficultyLabels[assignment.difficulty]}</p>
      <Link to="/assignments">К списку заданий</Link>
    </section>
  )
}