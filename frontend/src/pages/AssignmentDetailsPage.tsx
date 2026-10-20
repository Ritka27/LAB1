import { Link, useNavigate, useParams } from 'react-router'
import { difficultyLabels, statusLabels } from '../data/labels'
import type { Assignment } from '../types/assignment'

// Теперь страница получает не только список, но и функцию удаления из App.
type AssignmentDetailsPageProps = {
  assignments: Assignment[]
  onDelete: (id: string) => void
}

export function AssignmentDetailsPage({
  assignments,
  onDelete,
}: AssignmentDetailsPageProps) {
  const { id } = useParams()
  // Все хуки вызываем ДО условного return, иначе будет ошибка порядка хуков.
  const navigate = useNavigate()
  const assignment = assignments.find((item) => item.id === id)

  // Адрес верный, но записи нет (например, её уже удалили).
  if (!assignment) {
    return (
      <section>
        <h1>Задание не найдено</h1>
        <p>Задания с таким номером нет в списке.</p>
        <Link to="/assignments">К списку заданий</Link>
      </section>
    )
  }

  // Вынесли в функцию, чтобы разметка ниже осталась короткой.
  function handleDelete() {
    // TypeScript не помнит проверку выше внутри функции,
    // поэтому проверяем запись ещё раз.
    if (!assignment) return
    // confirm показывает окно «ОК / Отмена».
    // Отмена: ничего не происходит, запись остаётся.
    if (window.confirm(`Удалить задание «${assignment.title}»?`)) {
      onDelete(assignment.id)
      // replace: true заменяет запись в истории, чтобы «назад»
      // не вернуло на карточку уже удалённой записи.
      navigate('/assignments', { replace: true })
    }
  }

  return (
    <section>
      <h1>{assignment.title}</h1>
      <p>{assignment.description}</p>
      <p>Курс: {assignment.course}</p>
      <p>Дедлайн: {assignment.deadline}</p>
      <p>Статус: {statusLabels[assignment.status]}</p>
      <p>Сложность: {difficultyLabels[assignment.difficulty]}</p>

      <div className="details-actions">
        {/* «Изменить» оформлена как заметная кнопка, но остаётся ссылкой */}
        <Link
          className="button button-primary"
          to={`/assignments/${assignment.id}/edit`}
        >
          Изменить
        </Link>
        {/* type="button": это не отправка формы, а обычное действие */}
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