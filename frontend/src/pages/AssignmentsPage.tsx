import { Link } from 'react-router'
import { AssignmentCard } from '../components/AssignmentCard'
import { assignments } from '../data/assignments'

export function AssignmentsPage() {
  return (
    <section>
      <h1>Мои задания</h1>
      <Link to="/assignments/new">Добавить задание</Link>
      {assignments.length === 0 ? (
        <p>Заданий пока нет.</p>
      ) : (
        <div className="assignment-list">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </section>
  )
}