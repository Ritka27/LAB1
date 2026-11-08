import { Link, useNavigate, useParams } from 'react-router'
import { difficultyLabels, statusLabels } from '../data/labels'
import { useCourses } from '../hooks/useCourses'
import type { Assignment } from '../types/assignment'

type AssignmentDetailsPageProps = {
  assignments: Assignment[]
  onDelete: (id: string) => void
}

export function AssignmentDetailsPage({
  assignments,
  onDelete,
}: AssignmentDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { load } = useCourses()
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

  // название курса из справочника, запасной вариант — сам код
  let courseName = assignment.course
  if (load.status === 'loading') courseName = '…'
  if (load.status === 'success') {
    const course = load.data.find((item) => item.id === assignment.course)
    if (course) courseName = course.name
  }

  function handleDelete() {
    if (!assignment) return
    if (window.confirm(`Удалить задание «${assignment.title}»?`)) {
      onDelete(assignment.id)
      navigate('/assignments', { replace: true })
    }
  }

  return (
    <section>
      <h1>{assignment.title}</h1>
      <p>{assignment.description}</p>
      <p>Курс: {courseName}</p>
      <p>Дедлайн: {assignment.deadline}</p>
      <p>Статус: {statusLabels[assignment.status]}</p>
      <p>Сложность: {difficultyLabels[assignment.difficulty]}</p>

      <div className="details-actions">
        <Link
          className="button button-primary"
          to={`/assignments/${assignment.id}/edit`}
        >
          Изменить
        </Link>
        <button
          type="button"
          className="button button-danger"
          onClick={handleDelete}
        >
          Удалить
        </button>
      </div>

      <p>
        <Link to="/assignments">К списку заданий</Link>
      </p>
    </section>
  )
}