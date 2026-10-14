import { Link } from 'react-router'

export function NewAssignmentPage() {
  return (
    <section>
      <h1>Создание задания</h1>
      <p>Форма добавления задания появится в следующей лабораторной работе.</p>
      <Link to="/assignments">К списку заданий</Link>
    </section>
  )
}