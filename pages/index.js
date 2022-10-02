import { useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { FaPlus, FaAd, FaCheck } from 'react-icons/fa'
import { post } from '../utils'

export default function Index({ initialTodos }) {
  const [todos, setTodos] = useState(initialTodos)
  console.log(todos)

  const todoRef = useRef()

  async function newTodo() {
    let todoItem = todoRef.current.value
    let newTodo = { content: todoItem, finished: false }
    const resp = await post("/express/new", newTodo);
    console.log(resp)
    setTodos([...todos, newTodo])
    todoRef.current.value = ''
  }

  async function setFinished(index) {
    console.log(index)
    todos[index].finished = !todos[index].finished
    console.log(todos[index])
    await fetch(
      `/express/update?id=${todos[index]._id}&finished=${todos[index].finished}`,
    )
    setTodos([...todos])
  }

  async function getList() {
    const resp = await fetch('/express/ping')
    console.log(await resp.text())
  }

  async function pruneList() {
    await fetch('/express/prune')
    let newList = todos.filter((t) => !t.finished)
    setTodos(newList)
  }

  return (
    <div>
      <h1 className="font-bold text-center text-3xl my-4" onClick={getList}>
        todos
      </h1>
      <p className="text-center text-sm text-gray-700">
        The best way to manage your day.
      </p>
      <div className="flex justify-center my-20 mx-8 w-full h-full">
        {todos.length > 0 ? (
          <ul className="flex flex-col px-8 py-5 bg-red-100 rounded-lg">
            {todos.map((t, index) => (
              <div key={t._id} onClick={(_) => setFinished(index)}>
                <li
                  className={`hover:bg-black ${
                    t.finished ? 'line-through' : ''
                  } hover:text-white px-4 py-2 rounded-lg ease-linear transition-transform hover:scale-105 hover:cursor-pointer`}
                >
                  {t.content}
                </li>
                {index != todos.length - 1 ? (
                  <hr className="h-0.5 my-4 border-none rounded-lg bg-black"></hr>
                ) : (
                  ''
                )}
              </div>
            ))}
          </ul>
        ) : (
          ''
        )}
        <div className="mx-10 my-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="text"
              ref={todoRef}
              className="border-2 px-2 py-2 border-gray-700 rounded-md"
            ></input>
            <button onClick={newTodo} type="submit" className={styles.btn}>
              <FaPlus />
            </button>
            {todos.some((t) => t.finished) ? (
              <button
                onClick={pruneList}
                className={`bg-green-800 text-white ${styles.btn} border-white`}
              >
                <FaCheck />
              </button>
            ) : (
              ''
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

Index.getInitialProps = async () => {
  const resp = await fetch('http://localhost:6040/todos')
  const initialTodos = await resp.json()
  console.log({ initialTodos })
  return {
    initialTodos,
  }
}
