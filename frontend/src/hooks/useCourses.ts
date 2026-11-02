import { useEffect, useState } from 'react'
import type { Course } from '../types/course'
import { getCourses } from '../services/courses'

// Три возможных состояния загрузки. Данные (data) есть ТОЛЬКО в success,
// поэтому TypeScript не даст прочитать их, пока загрузка не завершилась.
export type CoursesLoad =
  | { status: 'loading' }                       // запрос идёт
  | { status: 'error'; message: string }        // запрос не удался
  | { status: 'success'; data: Course[] }       // получили курсы (возможно, пустой список)

export function useCourses() {
  // Текущее состояние загрузки. Сразу при появлении формы мы «загружаем».
  const [load, setLoad] = useState<CoursesLoad>({ status: 'loading' })

  // Номер попытки. Когда он меняется, эффект ниже запускается заново.
  // Так «Повторить» перезапускает загрузку без перезагрузки страницы.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // AbortController позволяет ОТМЕНИТЬ запрос (например, при уходе со страницы).
    const controller = new AbortController()
    // Флаг «этот запуск ещё актуален». Относится к ОДНОМУ запуску эффекта.
    let active = true

    setLoad({ status: 'loading' })

    getCourses(controller.signal)
      .then((data) => {
        // Если запуск уже устарел (форма закрыта или началась новая попытка),
        // результат игнорируем и состояние не трогаем.
        if (active) setLoad({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!active) return
        // error имеет тип unknown, поэтому проверяем, что это Error
        const message =
          error instanceof Error ? error.message : 'Не удалось загрузить справочник.'
        setLoad({ status: 'error', message })
      })

    // ФУНКЦИЯ ОЧИСТКИ. React вызывает её, когда форма исчезает с экрана
    // или когда эффект запускается заново (смена attempt).
    return () => {
      active = false     // сначала помечаем запуск устаревшим...
      controller.abort() // ...потом отменяем сам запрос
    }
  }, [attempt]) // эффект зависит только от номера попытки

  // Повторная попытка: показываем «загрузка» и увеличиваем номер попытки.
  function retry() {
    setLoad({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  // Форма получает состояние и функцию повтора
  return { load, retry }
}