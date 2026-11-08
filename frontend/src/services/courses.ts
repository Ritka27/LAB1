import type { Course } from '../types/course'

// данные из сети могут быть любыми, поэтому принимаем unknown
function isCourse(value: unknown): value is Course {
  if (typeof value !== 'object' || value === null) return false
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    value.id === value.id.trim() &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  )
}

// проверяет весь ответ: массив курсов с уникальными id
export function parseCourses(value: unknown): Course[] {
  if (!Array.isArray(value) || !value.every(isCourse)) {
    throw new Error('Неверная структура справочника курсов.')
  }
  const courses: Course[] = value

  // по id работают select и key, поэтому повторы недопустимы
  const ids = new Set(courses.map((course) => course.id))
  if (ids.size !== courses.length) {
    throw new Error('В справочнике повторяются идентификаторы.')
  }

  // пустой массив тоже корректный ответ, его обработает интерфейс
  return courses
}

const coursesUrl = `${import.meta.env.BASE_URL}demo/courses.json`

export async function getCourses(signal: AbortSignal): Promise<Course[]> {
  // no-store: не брать старую копию из кэша браузера
  const response = await fetch(coursesUrl, { signal, cache: 'no-store' })

  // fetch не считает ошибкой 404 и 500, поэтому статус проверяем сами
  if (!response.ok) {
    throw new Error(`Не удалось загрузить курсы: HTTP ${response.status}`)
  }

  const value: unknown = await response.json()
  return parseCourses(value)
}
