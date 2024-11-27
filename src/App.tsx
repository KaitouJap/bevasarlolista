import { useState, useRef } from 'react'
import './shoppinglist.css'

interface Task{
  id: number;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskQuantity, setNewTaskQuantity] = useState(0);
  const [newTaskUnit, setNewTaskUnit] = useState("");
  const [error, setError] = useState("");
  const inputRefName = useRef<HTMLInputElement>(null);
  const inputRefQuantity = useRef<HTMLInputElement>(null);
  const inputRefUnit = useRef<HTMLInputElement>(null);
  const allTaskCompleted = tasks.length > 0 && tasks.every((task) => task.completed);
  const addTask = () => {
    if(newTaskName.trim() === ''){
      setError("A bevásárló lista elem nevet kotelezo megadni!");
      inputRefName.current?.focus();
      return;
    }
    if(newTaskName.length > 30){
      setError("A bevásárló lista elem neve maximum 30 karakter!");
      setNewTaskName("");
      inputRefName.current?.focus();
      return;
    }
    if(newTaskQuantity <= 0){
      setError("A bevásárló lista elem mennyisege nem lehet 0 vagy kisebb!")
      setNewTaskQuantity(0);
      inputRefQuantity.current?.focus();
      return;
    }
    if(newTaskUnit.trim() === ''){
      setError("A bevásárló lista elem mennyiség egysége nem lehet üres!")
      setNewTaskUnit("");
      inputRefUnit.current?.focus();
      return;
    }
    if(tasks.some((task) => 
      task.name.toLocaleLowerCase() === newTaskName.trim().toLocaleLowerCase())){
      setError("Ez a bevásárló lista elem mar letezik!");
      setNewTaskName("");
      inputRefName.current?.focus();
      return;
    }
    setTasks((prevTasks) => 
      [...prevTasks, 
        {
          id:Date.now(), 
          name: newTaskName.trim(), 
          quantity: newTaskQuantity, 
          unit: newTaskUnit.trim(), 
          completed: false
        }
      ]);
    setNewTaskName('');
    setNewTaskQuantity(0);
    setNewTaskUnit("");
    setError("");
  };
  const removeTask = (taskId: number) => {
    setTasks((prevTask) => prevTask.filter((task) => task.id !== taskId));
  };
  const toggleTaskCompleted = (index: number) => {
    setTasks((prevTask) =>  
      prevTask.map((task) =>
      task.id === index ? {...task, completed: !task.completed} : task));
  };

  return (
    <div className='container'>
      <h2>Bevásárló lista</h2>
      <div className='input-group'>
        <label>
          Terméknév:
        </label>
          <input type="text" value={newTaskName} ref={inputRefName} onChange={(e) => setNewTaskName(e.target.value)} />
        <br/><label>
          Mennyiség:
        </label>
          <input type="number" min={0} value={newTaskQuantity} ref={inputRefQuantity} onChange={(e) => setNewTaskQuantity(parseFloat(e.target.value))} />
        <br/><label>
          Mennyiség egység:
        </label>
          <input type="text" value={newTaskUnit} ref={inputRefUnit} onChange={(e) => setNewTaskUnit(e.target.value)} />
          <button onClick={addTask}>Hozzáadás</button>
      </div>
      <p className='error-message'>{error}</p>
      <ul className='task-list'>
        {tasks.map(task => {
          const taskClass = `task ${task.completed?"completed":""}`;
          return(
            <li key={task.id} className={taskClass}>
              <span>{task.name}</span>
              <span>{task.quantity}</span>
              <span>{task.unit}</span>
              <button onClick={()=>removeTask(task.id)}>torles</button>
            <button onClick={()=>toggleTaskCompleted(task.id)}>{task.completed?"Visszaalittas":"Kesz"}</button>
            </li>
          )
        })}
      </ul>
      {allTaskCompleted && <p className='completed-message'>Minden feladatot elvegeztel!</p>}
    </div>
  )
}

export default App
