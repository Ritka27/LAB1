import { useEffect, useState } from 'react'
import type { Course } from '../types/course'
import { getCourses } from '../services/courses'

// data есть только в success, поэтому до конца загрузки её не прочитать
export type CoursesLoad =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Course[] }

export function useCourses() {
  const [load, setLoad] = useState<CoursesLoad>({ status: 'loading' })
  // при смене attempt эффект запускается заново (кнопка «Повторить»)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setLoad({ status: 'loading' })

    getCourses(controller.signal)
      .then((data) => {
        // устаревший ответ игнорируем
        if (active) setLoad({ status: 'success', data })
      })
      .catch((error: unknown) => {
        if (!active) return
        const message =
          error instanceof Error ? error.message : 'Не удалось загрузить справочник.'
        setLoad({ status: 'error', message })
      })

    // уходим со страницы или начинаем новую попытку: отменяем запрос
    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setLoad({ status: 'loading' })
    setAttempt((current) => current + 1)
  }

  return { load, retry }
}
