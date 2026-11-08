import { Link, useNavigate, useParams } from 'react-router'
import { AssignmentForm } from '../components/AssignmentForm'
import type { Assignment, AssignmentDraft } from '../types/assignment'

type EditAssignmentPageProps = {
  assignments: Assignment[]
  onUpdate: (id: string, draft: AssignmentDraft) => void
}

export function EditAssignmentPage({
  assignments,
  onUpdate,
}: EditAssignmentPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  if (!assignment) {
    return (
      <section>
        <h1>Задание не найдено</h1>
        <p>Редактировать нечего: задания с таким номером нет.</p>
        <Link to="/assignments">К списку заданий</Link>
      </section>
    )
  }

  // форма правит копию полей без id, а не саму запись
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
        // key = id: useState берёт initialValues только при создании,
        // поэтому при смене записи форму нужно создать заново
        key={assignment.id}
        initialValues={initialValues}
        onSave={(draft) => {
          onUpdate(assignment.id, draft)
          navigate(`/assignments/${assignment.id}`)
        }}
        onCancel={() => navigate(`/assignments/${assignment.id}`)}
      />
    </section>
  )
}