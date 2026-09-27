import { useState } from 'react'
import { TaskDashBoard } from './components/TaskDashBoard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TaskDashBoard></TaskDashBoard>
    </>
  )
}

export default App
