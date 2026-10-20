import { useNavigate } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { AssignmentDraft } from '../types/assignment'

// Контракт страницы: она получает функцию создания из App.
// Функция принимает черновик и возвращает id новой записи.
type NewAssignmentPageProps = {
  onCreate: (draft: AssignmentDraft) => string
}

// Значения пустой формы. Вынесены за компонент, чтобы не создаваться заново
// при каждой перерисовке. Статус и сложность задаём по умолчанию.
const emptyAssignment: AssignmentDraft = {
  title: '',
  description: '',
  course: '',
  deadline: '',
  status: 'todo',
  difficulty: 'medium',
}

export function NewAssignmentPage({ onCreate }: NewAssignmentPageProps) {
  // useNavigate даёт функцию для перехода из обработчика (не по клику на ссылку).
  const navigate = useNavigate()

  // Вызывается формой только после успешной проверки.
  function handleSave(draft: AssignmentDraft) {
    // onCreate добавляет запись в общий список и возвращает её id.
    const id = onCreate(draft)
    // Открываем карточку новой записи по её адресу.
    navigate(`/assignments/${id}`)
  }

  return (
    <section>
      <h1>Создание задания</h1>
      <AssignmentForm
        initialValues={emptyAssignment}
        onSave={handleSave}
        // Отмена: просто уходим к списку, в общий список ничего не попадает.
        onCancel={() => navigate('/assignments')}
      />
    </section>
  )
}