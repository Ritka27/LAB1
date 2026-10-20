import { useState } from 'react'
import { Link } from 'react-router'
import { AssignmentCard } from '../components/AssignmentCard'
import { statusLabels } from '../data/labels'
import type { Assignment, AssignmentStatus } from '../types/assignment'

type AssignmentsPageProps = { assignments: Assignment[] }

// Фильтр: один из статусов или особое значение 'all' («Все»).
type StatusFilter = AssignmentStatus | 'all'

// Значение из <select> приходит строкой. Проверяем, что оно допустимо,
// и только тогда считаем его типом StatusFilter (без any).
function isStatusFilter(value: string): value is StatusFilter {
  return (
    value === 'all' ||
    value === 'todo' ||
    value === 'in_progress' ||
    value === 'done'
  )
}

export function AssignmentsPage({ assignments }: AssignmentsPageProps) {
  // Выбранный фильтр: локальное состояние страницы.
  // Общий список в App от него не зависит.
  const [status, setStatus] = useState<StatusFilter>('all')

  // Отбор ВЫЧИСЛЯЕТСЯ из полного списка при каждой отрисовке.
  // Мы не сохраняем его и не вызываем setAssignments: записи не удаляются.
  const visibleAssignments = assignments.filter(
    (item) => status === 'all' || item.status === status,
  )

  return (
    <section>
      <h1>Мои задания</h1>
      <Link to="/assignments/new">Добавить задание</Link>

      {/* Фильтр показываем, только если записи вообще есть */}
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
          {/* Сброс возвращает фильтр в «Все» */}
          <button type="button" onClick={() => setStatus('all')}>
            Сбросить фильтр
          </button>
        </div>
      )}

      {/* Три состояния: записей нет / нет совпадений / показываем список */}
      {assignments.length === 0 ? (
        <p>Заданий пока нет.</p>
      ) : visibleAssignments.length === 0 ? (
        <p>Нет заданий с таким статусом.</p>
      ) : (
        <div className="assignment-list">
          {visibleAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </section>
  )
}