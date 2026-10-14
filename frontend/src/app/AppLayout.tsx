import { NavLink, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="app">
      <header>
        <p className="app-title">Учебный менеджер</p>
        <nav aria-label="Основная навигация">
          <NavLink to="/assignments" end>Задания</NavLink>
          <NavLink to="/assignments/new">Создать</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}