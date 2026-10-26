import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  AssignmentDifficulty,
  AssignmentDraft,
  AssignmentStatus,
} from '../types/assignment'

// Свойства формы
type AssignmentFormProps = {
  initialValues: AssignmentDraft
  onSave: (draft: AssignmentDraft) => void
  onCancel: () => void
}

// Проверка допустимых значений
function isStatus(value: string): value is AssignmentStatus {
  return value === 'todo' || value === 'in_progress' || value === 'done'
}

function isDifficulty(value: string): value is AssignmentDifficulty {
  return value === 'easy' || value === 'medium' || value === 'hard'
}

export function AssignmentForm({
  initialValues,
  onSave,
  onCancel,
}: AssignmentFormProps) {
  // Черновик формы
  const [draft, setDraft] = useState<AssignmentDraft>(() => ({
    ...initialValues,
  }))
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Убираем пробелы по краям
    const title = draft.title.trim()
    const description = draft.description.trim()
    const course = draft.course.trim()

    // Проверка введённых данных
    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
      return
    }
    if (!course) {
      setError('Укажите курс.')
      return
    }
    if (!draft.deadline) {
      setError('Укажите дедлайн.')
      return
    }
    if (description.length < 10) {
      setError('Описание задания должно содержать не меньше 10 символов.')
      return
    }

    // Сохраняем черновик
    setError('')
    onSave({ ...draft, title, description, course })
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="assignment-title">Название</label>
      <input
        id="assignment-title"
        value={draft.title}
        required
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
      />

      <label htmlFor="assignment-description">Описание</label>
      <textarea
        id="assignment-description"
        value={draft.description}
        rows={4}
        required
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
      />

      <label htmlFor="assignment-course">Курс</label>
      <input
        id="assignment-course"
        value={draft.course}
        required
        onChange={(e) => setDraft({ ...draft, course: e.target.value })}
      />

      <label htmlFor="assignment-deadline">Дедлайн</label>
      <input
        id="assignment-deadline"
        type="date"
        value={draft.deadline}
        required
        onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
      />

      <label htmlFor="assignment-status">Статус</label>
      <select
        id="assignment-status"
        value={draft.status}
        onChange={(e) => {
          const status = e.target.value
          if (isStatus(status)) setDraft({ ...draft, status })
        }}
      >
        <option value="todo">К выполнению</option>
        <option value="in_progress">В работе</option>
        <option value="done">Выполнено</option>
      </select>

      <label htmlFor="assignment-difficulty">Сложность</label>
      <select
        id="assignment-difficulty"
        value={draft.difficulty}
        onChange={(e) => {
          const difficulty = e.target.value
          if (isDifficulty(difficulty)) setDraft({ ...draft, difficulty })
        }}
      >
        <option value="easy">Лёгкое</option>
        <option value="medium">Среднее</option>
        <option value="hard">Сложное</option>
      </select>

      {/* Отображение ошибки */}
      {error && <p role="alert" className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}