import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './app/AppLayout'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { AssignmentDetailsPage } from './pages/AssignmentDetailsPage'
import { NewAssignmentPage } from './pages/NewAssignmentPage'
import { NotFoundPage } from './pages/NotFoundPage'
import type { Assignment, AssignmentDraft } from './types/assignment'
import { EditAssignmentPage } from './pages/EditAssignmentPage'
// Демонстрационные данные: только начальное значение состояния.
import { assignments as initialAssignments } from './data/assignments'
import './App.css'

export default function App() {
  // Общий список заданий. Живёт в App, потому что App не пропадает
  // при переходах между страницами. setAssignments сообщает React об изменении.
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    initialAssignments.map((a) => ({ ...a })),
  )

  // СОЗДАНИЕ: добавляет id к черновику и кладёт в новый массив.
  function createAssignment(draft: AssignmentDraft): string {
    const id = crypto.randomUUID()
    setAssignments((current) => [...current, { ...draft, id }])
    return id
  }

  // ИЗМЕНЕНИЕ: заменяет запись с этим id, остальные не трогает.
  function updateAssignment(id: string, draft: AssignmentDraft): void {
    setAssignments((current) =>
      current.map((item) =>
        item.id === id ? { ...draft, id: item.id } : item,
      ),
    )
  }

  // УДАЛЕНИЕ: оставляет все записи, кроме записи с этим id.
  function deleteAssignment(id: string): void {
    setAssignments((current) => current.filter((item) => item.id !== id))
  }

  return (
    <Routes>
      {/* Общий layout: шапка и Outlet для всех вложенных страниц */}
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/assignments" replace />} />

        {/* Список и подробности получают актуальный список через props */}
        <Route
          path="assignments"
          element={<AssignmentsPage assignments={assignments} />}
        />

        {/* Страница создания получает функцию createAssignment из App */}
        <Route
          path="assignments/new"
          element={<NewAssignmentPage onCreate={createAssignment} />}
        />

        <Route  
          path="assignments/:id"
          element={
        <AssignmentDetailsPage
          assignments={assignments}
          onDelete={deleteAssignment}
    />
  }
/>
        {/* Редактирование: тот же id, но с суффиксом /edit */}
        <Route
           path="assignments/:id/edit"
          element={
          <EditAssignmentPage
          assignments={assignments}
          onUpdate={updateAssignment}
    />
  }
/>
        {/* Всё остальное: неизвестный адрес */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}