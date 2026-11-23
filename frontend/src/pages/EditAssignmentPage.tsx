import { Link, useNavigate, useParams } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { Assignment, AssignmentDraft } from '../types/assignment'

// Контракт страницы: общий список и функция изменения из App.
type EditAssignmentPageProps = {
  assignments: Assignment[]
  onUpdate: (id: string, draft: AssignmentDraft) => void
}

export function EditAssignmentPage({
  assignments,
  onUpdate,
}: EditAssignmentPageProps) {
  // id из адреса: /assignments/a1/edit -> id = 'a1'
  const { id } = useParams()
  // Хуки (useParams, useNavigate) вызываем ДО условного return,
  // иначе React выдаст ошибку про порядок хуков.
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  // Адрес вида /assignments/missing/edit: записи нет.
  if (!assignment) {
    return (
      <section>
        <h1>Задание не найдено</h1>
        <p>Редактировать нечего: задания с таким номером нет.</p>
        <Link to="/assignments">К списку заданий</Link>
      </section>
    )
  }

  // Начальные значения формы: копия полей записи БЕЗ id.
  // Это и есть начало черновика: форма правит копию, а не саму запись.
  const initialValues: AssignmentDraft = {
    title: assignment.title,
    description: assignment.description,
    course: assignment.course,
    deadline: assignment.deadline,
    status: assignment.status,
    difficulty: assignment.difficulty,
  }

  return (
    <section>
      <h1>Редактирование задания</h1>
      <AssignmentForm
        // key = id: при переходе к другой записи форма создаётся заново
        // и не показывает поля предыдущей записи. useState берёт
        // initialValues только при создании компонента, а не при каждом изменении props.
        key={assignment.id}
        initialValues={initialValues}
        onSave={(draft) => {
          // Заменяем запись в общем списке, id остаётся прежним.
          onUpdate(assignment.id, draft)
          // После сохранения возвращаемся на карточку.
          navigate(`/assignments/${assignment.id}`)
        }}
        // Отмена: просто уходим на карточку, список не менялся.
        onCancel={() => navigate(`/assignments/${assignment.id}`)}
      />
    </section>
  )
}