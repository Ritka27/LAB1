import { useState } from 'react'
import { Link } from 'react-router'
import { AssignmentCard } from '../components/AssignmentCard'
import { statusLabels } from '../data/labels'
import { useCourses } from '../hooks/useCourses'
import type { Assignment, AssignmentStatus } from '../types/assignment'

type AssignmentsPageProps = { assignments: Assignment[] }

type StatusFilter = AssignmentStatus | 'all'

function isStatusFilter(value: string): value is StatusFilter {
  return (
    value === 'all' ||
    value === 'todo' ||
    value === 'in_progress' ||
    value === 'done'
  )
}

export function AssignmentsPage({ assignments }: AssignmentsPageProps) {
  const [status, setStatus] = useState<StatusFilter>('all')

  const { load } = useCourses()

  // название курса по id; пока грузится «…», при ошибке или неизвестном id сам код
  function courseLabel(courseId: string): string {
    if (load.status === 'loading') return '…'
    if (load.status === 'error') return courseId
    const course = load.data.find((item) => item.id === courseId)
    return course ? course.name : courseId
  }

  const visibleAssignments = assignments.filter(
    (item) => status === 'all' || item.status === status,
  )

  return (
    <section>
      <h1>Мои задания</h1>
      <Link to="/assignments/new">Добавить задание</Link>

      {assignments.length > 0 && (
        <div className="filter">
          <label htmlFor="status-filter">Статус</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => {
              const value = e.target.value
              if (isStatusFilter(value)) setStatus(value)
            }}
          >
            <option value="all">Все</option>
            <option value="todo">{statusLabels.todo}</option>
            <option value="in_progress">{statusLabels.in_progress}</option>
            <option value="done">{statusLabels.done}</option>
          </select>
          <button type="button" onClick={() => setStatus('all')}>
            Сбросить фильтр
          </button>
        </div>
      )}

      {assignments.length === 0 ? (
        <p>Заданий пока нет.</p>
      ) : visibleAssignments.length === 0 ? (
        <p>Нет заданий с таким статусом.</p>
      ) : (
        <div className="assignment-list">
          {visibleAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              courseName={courseLabel(assignment.course)}
            />
          ))}
        </div>
      )}
    </section>
  )
}