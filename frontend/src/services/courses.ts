import type { Course } from '../types/course'

// ===== ШАГ 4. Проверка структуры данных =====

// Проверяет ОДИН элемент. value is Course значит: если функция вернула true,
// TypeScript дальше считает значение типом Course.
// Принимаем unknown, потому что данные из сети могут быть чем угодно.
function isCourse(value: unknown): value is Course {
  // Сначала убеждаемся, что это объект, иначе обращаться к полям нельзя
  if (typeof value !== 'object' || value === null) return false
  return (
    // id: строка, не пустая и без пробелов по краям
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    value.id === value.id.trim() &&
    // name: непустая строка
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  )
}

// Проверяет весь ответ: это массив из корректных курсов с уникальными id.
// Экспортируем, чтобы можно было проверить отдельно от сети.
export function parseCourses(value: unknown): Course[] {
  // Не массив или хоть один элемент неверный: это ошибка структуры.
  if (!Array.isArray(value) || !value.every(isCourse)) {
    throw new Error('Неверная структура справочника курсов.')
  }
  const courses: Course[] = value

  // id нужны уникальными: по ним работает select и React key.
  // Set хранит только уникальные значения, поэтому размер меньше при повторах.
  const ids = new Set(courses.map((course) => course.id))
  if (ids.size !== courses.length) {
    throw new Error('В справочнике повторяются идентификаторы.')
  }

  // Пустой массив [] допустим: это корректный ответ «курсов нет».
  // Его отдельно обработает интерфейс.
  return courses
}

// ===== ШАГ 5. Запрос по HTTP =====

// BASE_URL учитывает базовый путь Vite (обычно "/"),
// получается /demo/courses.json. Слово public в адресе не пишется.
const coursesUrl = `${import.meta.env.BASE_URL}demo/courses.json`

// signal нужен для отмены запроса: его передаст компонент (через хук).
export async function getCourses(signal: AbortSignal): Promise<Course[]> {
  // fetch отправляет GET-запрос. cache: 'no-store' просит браузер
  // не брать старую копию, чтобы после правки JSON видеть свежие данные.
  const response = await fetch(coursesUrl, { signal, cache: 'no-store' })

  // fetch НЕ считает ошибкой ответ 404 или 500: промис выполнится успешно.
  // Поэтому статус проверяем сами через response.ok.
  if (!response.ok) {
    throw new Error(`Не удалось загрузить курсы: HTTP ${response.status}`)
  }

  // json() читает тело и разбирает его. Результат принимаем как unknown.
  // Если вместо JSON пришёл HTML (пусть даже со статусом 200), здесь будет ошибка.
  const value: unknown = await response.json()

  // Проверяем структуру. Только после этого данные можно считать курсами.
  return parseCourses(value)
}