import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  AssignmentDifficulty,
  AssignmentDraft,
  AssignmentStatus,
} from '../types/assignment'

// Контракт формы: начальные значения и два обработчика.
// Форма сама ничего не знает про список, она только отдаёт готовый черновик.
type AssignmentFormProps = {
  initialValues: AssignmentDraft
  onSave: (draft: AssignmentDraft) => void
  onCancel: () => void
}

// Значение из <select> всегда строка. Эти функции проверяют,
// что строка допустима, и только тогда TypeScript считает её нужным типом.
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
  // ЧЕРНОВИК. Копия начальных значений: правка черновика не меняет
  // исходную запись, поэтому «Отмена» оставляет всё как было.
  const [draft, setDraft] = useState<AssignmentDraft>(() => ({
    ...initialValues,
  }))
  // Текст ошибки. Пустая строка значит «ошибок нет».
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Отменяем стандартную отправку формы, иначе страница перезагрузится
    // и состояние в памяти пропадёт.
    event.preventDefault()

    // trim() убирает пробелы по краям: название из одних пробелов не пройдёт.
    const title = draft.title.trim()
    const description = draft.description.trim()
    const course = draft.course.trim()

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
    // Предметное правило темы «Учебный менеджер».
    if (description.length < 10) {
      setError('Описание задания должно содержать не меньше 10 символов.')
      return
    }

    // Проверки прошли: очищаем ошибку и отдаём черновик наверх.
    // Введённые поля при ошибке не сбрасываются: черновик остаётся в состоянии.
    setError('')
    onSave({ ...draft, title, description, course })
  }

  return (
    // noValidate отключает браузерные подсказки: показываем свою ошибку.
    <form className="assignment-form" onSubmit={handleSubmit} noValidate>
      {/* Управляемое поле: value берётся из состояния, onChange его обновляет.
          {...draft, title: ...} создаёт новый объект, а не меняет старый. */}
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

      {/* role="alert": экранные читалки сразу зачитывают ошибку */}
      {error && <p role="alert" className="form-error">{error}</p>}

      <div className="form-actions">
        {/* type="submit" запускает handleSubmit (в том числе по Enter) */}
        <button type="submit">Сохранить</button>
        {/* type="button" обязателен: иначе «Отмена» отправит форму */}
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  )
}