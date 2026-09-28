import './App.css'

const appTitle: string = 'Учебный менеджер'

export default function App() {
  return (
    <main className="app">
      <header>
        <h1>{appTitle}</h1>
        <p>Учебные задания, курсы и дедлайны.</p>
      </header>

      <section aria-labelledby="items-title">
        <h2 id="items-title">Мои задания</h2>
        <p>Здесь появится список ваших заданий.</p>
      </section>
    </main>
  )
}