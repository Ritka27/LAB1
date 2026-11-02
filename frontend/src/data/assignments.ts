import type { Assignment } from '../types/assignment'

export const assignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Лабораторная работа по хешированию',
    description: 'Реализовать хеш-таблицу методом цепочек и открытой адресацией.',
    course: 'algorithms',
    deadline: '2026-10-20',
    status: 'in_progress',
    difficulty: 'hard',
  },
  {
    id: 'a2',
    title: 'Стартовый проект на React',
    description: 'Создать проект на Vite, заменить стартовый экран и опубликовать в Git.',
    course: 'web',
    deadline: '2026-10-14',
    status: 'done',
    difficulty: 'easy',
  },
  {
    id: 'a3',
    title: 'Домашнее задание по pandas',
    description: 'Ответить на пять вопросов по базе Northwind с помощью pandas.',
    course: 'data-analysis',
    deadline: '2026-10-25',
    status: 'todo',
    difficulty: 'medium',
  },
  {
    id: 'a4',
    title: 'Курсовая: алгоритмы на графах',
    description: 'Описать и реализовать алгоритмы поиска компонент сильной связности.',
    course: 'algorithms',
    deadline: '2026-11-15',
    status: 'in_progress',
    difficulty: 'hard',
  },
  {
    id: 'a5',
    title: 'Конспект по нормализации БД',
    description: 'Подготовить краткий конспект по нормальным формам.',
    course: 'databases',
    deadline: '2026-10-10',
    status: 'todo',
    difficulty: 'easy',
  },
]