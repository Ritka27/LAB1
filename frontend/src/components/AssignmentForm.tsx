import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import type {
  AssignmentDifficulty,
  AssignmentDraft,
  AssignmentStatus,
} from '../types/assignment'
import type { Course } from '../types/course'
import { useCourses } from '../hooks/useCourses'

type AssignmentFormProps = {
  initialValues: AssignmentDraft
  onSave: (draft: AssignmentDraft) => void
  onCancel: () => void
}

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
  // черновик формы, повторная загрузка справочника его не трогает
  const [draft, setDraft] = useState<AssignmentDraft>(() => ({
    ...initialValues,
  }))
  const [error, setError] = useState('')

  const { load, retry } = useCourses()

  const courses: Course[] = load.status === 'success' ? load.data : []
  const selectedCourseExists = courses.some((course) => course.id === draft.course)
  // сохранять можно, только если справочник загружен и курс выбран из него
  const canSave = load.status === 'success' && selectedCourseExists

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    // кнопку можно обойти клавишей Enter, поэтому проверяем и здесь
    if (!canSave) {
      setError('Дождитесь справочника и выберите курс из списка.')
      return
    }

    const title = draft.title.trim()
    const description = draft.description.trim()

    if (title.length < 3 || title.length > 100) {
      setError('Название должно содержать от 3 до 100 символов.')
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

    setError('')
    onSave({ ...draft, title, description })
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
      <select
        id="assignment-course"
        value={draft.course}
        required
        disabled={load.status !== 'success' || courses.length === 0}
        onChange={(e) => setDraft({ ...draft, course: e.target.value })}
      >
        <option value="">Выберите курс</option>
        {/* курса записи нет в справочнике: показываем его код недоступным пунктом */}
        {draft.course !== '' && !selectedCourseExists && (
          <option value={draft.course} disabled>
            Текущий код: {draft.course} — выберите доступный курс
          </option>
        )}
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {load.status === 'loading' && (
        <p role="status" className="course-status">Загружаем курсы…</p>
      )}

      {load.status === 'error' && (
        <div className="course-status course-status-error">
          <p role="alert">{load.message}</p>
          <button type="button" onClick={retry}>Повторить</button>
        </div>
      )}

      {load.status === 'success' && courses.length === 0 && (
        <div className="course-status">
          <p role="status">Курсов пока нет. Сохранение недоступно.</p>
          <button type="button" onClick={retry}>Повторить</button>
        </div>
      )}

      {load.status === 'success' &&
        courses.length > 0 &&
        draft.course !== '' &&
        !selectedCourseExists && (
          <p role="status" className="course-status">
            Прежнего курса нет в справочнике. Выберите доступный.
          </p>
        )}

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

      {error && <p role="alert" className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={!canSave}>Сохранить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}