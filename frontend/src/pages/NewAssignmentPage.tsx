import { useNavigate } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { AssignmentDraft } from '../types/assignment'

// onCreate возвращает id новой записи
type NewAssignmentPageProps = {
  onCreate: (draft: AssignmentDraft) => string
}

// значения пустой формы, статус и сложность по умолчанию
const emptyAssignment: AssignmentDraft = {
  title: '',
  description: '',
  course: '',
  deadline: '',
  status: 'todo',
  difficulty: 'medium',
}

export function NewAssignmentPage({ onCreate }: NewAssignmentPageProps) {
  const navigate = useNavigate()

  function handleSave(draft: AssignmentDraft) {
    const id = onCreate(draft)
    navigate(`/assignments/${id}`)
  }

  return (
    <section>
      <h1>Создание задания</h1>
      <AssignmentForm
        initialValues={emptyAssignment}
        onSave={handleSave}
        onCancel={() => navigate('/assignments')}
      />
    </section>
  )
}