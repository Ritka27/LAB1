import type { Course } from '../types/course'
import { supabase } from '../lib/supabase'

// Проверка одного элемента: данные из сети могут быть чем угодно.
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

// Проверка всего ответа: массив корректных курсов с уникальными id.
export function parseCourses(value: unknown): Course[] {
  if (!Array.isArray(value) || !value.every(isCourse)) {
    throw new Error('Неверная структура справочника курсов.')
  }
  const courses: Course[] = value

  const ids = new Set(courses.map((course) => course.id))
  if (ids.size !== courses.length) {
    throw new Error('В справочнике повторяются идентификаторы.')
  }

  return courses
}

export async function getCourses(signal: AbortSignal): Promise<Course[]> {
  // order нужен: без него порядок строк не гарантирован.
  const { data, error } = await supabase
    .from('courses')
    .select('id, name')
    .order('name')
    .abortSignal(signal)

  if (signal.aborted) {
    throw new DOMException('Запрос отменён', 'AbortError')
  }
  // Supabase возвращает error, а не бросает исключение: проверяем до data.
  if (error) {
    throw new Error(`Не удалось загрузить курсы: ${error.message}`)
  }
  return parseCourses(data)
}
