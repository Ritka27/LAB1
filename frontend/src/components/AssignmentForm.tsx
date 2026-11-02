import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import type {
  AssignmentDifficulty,
  AssignmentDraft,
  AssignmentStatus,
} from '../types/assignment'
import type { Course } from '../types/course' // НОВОЕ
import { useCourses } from '../hooks/useCourses' // НОВОЕ

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
  // ЧЕРНОВИК формы (как в ЛР 3). Повторная загрузка справочника его не трогает.
  const [draft, setDraft] = useState<AssignmentDraft>(() => ({
    ...initialValues,
  }))
  const [error, setError] = useState('')

  // НОВОЕ: состояние загрузки курсов живёт в хуке, форма только читает его.
  // Хук вызываем один раз и на верхнем уровне компонента.
  const { load, retry } = useCourses()

  // НОВОЕ: курсы доступны только после успешной загрузки, иначе пустой список.
  const courses: Course[] = load.status === 'success' ? load.data : []
  // НОВОЕ: есть ли выбранный id среди загруженных курсов
  const selectedCourseExists = courses.some((course) => course.id === draft.course)
  // НОВОЕ: сохранять можно, только если справочник загружен И курс выбран из него
  const canSave = load.status === 'success' && selectedCourseExists

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    // НОВОЕ (шаг 9): защита и в самой операции сохранения, а не только кнопкой.
    // Кнопку можно обойти (например, клавишей Enter), поэтому проверяем здесь тоже.
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
    // УБРАНО: проверка «Укажите курс» — её заменил canSave выше
    if (!draft.deadline) {
      setError('Укажите дедлайн.')
      return
    }
    if (description.length < 10) {
      setError('Описание задания должно содержать не меньше 10 символов.')
      return
    }

    setError('')
    // course больше не обрезаем: это id из справочника, он уже проверен
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

      {/* НОВОЕ: вместо текстового поля курса теперь выбор из справочника */}
      <label htmlFor="assignment-course">Курс</label>
      <select
        id="assignment-course"
        value={draft.course} // в черновике лежит id курса
        required
        // пока курсы не загружены или их нет, выбирать нечего
        disabled={load.status !== 'success' || courses.length === 0}
        onChange={(e) => setDraft({ ...draft, course: e.target.value })}
      >
        <option value="">Выберите курс</option>
        {/* Если у записи курс, которого нет в справочнике (или он ещё грузится),
            показываем его код отдельным недоступным пунктом.
            Автоматически подставлять первый курс нельзя: запись молча изменилась бы. */}
        {draft.course !== '' && !selectedCourseExists && (
          <option value={draft.course} disabled>
            Текущий код: {draft.course} — выберите доступный курс
          </option>
        )}
        {/* value хранит id, а пользователь видит name */}
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>

      {/* НОВОЕ (шаг 8): состояния загрузки справочника */}
      {load.status === 'loading' && (
        <p role="status" className="course-status">Загружаем курсы…</p>
      )}

      {load.status === 'error' && (
        <div className="course-status course-status-error">
          <p role="alert">{load.message}</p>
          {/* type="button": это не отправка формы, а перезапуск загрузки.
              Черновик не меняется, потому что хук его не знает. */}
          <button type="button" onClick={retry}>Повторить</button>
        </div>
      )}

      {load.status === 'success' && courses.length === 0 && (
        <div className="course-status">
          <p role="status">Курсов пока нет. Сохранение недоступно.</p>
          <button type="button" onClick={retry}>Повторить</button>
        </div>
      )}

      {/* Справочник загружен, но прежнего курса записи в нём нет */}
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
        {/* НОВОЕ: кнопка недоступна, пока нельзя сохранять */}
        <button type="submit" disabled={!canSave}>Сохранить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}