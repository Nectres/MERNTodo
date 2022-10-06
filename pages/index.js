import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { FaPlus, FaCheck, FaUser } from 'react-icons/fa'
import { post } from '../utils'
import Head from 'next/head'

export default function Index({ initialTodos }) {
  const [todos, setTodos] = useState(initialTodos)
  const [showLogin, setShowLogin] = useState(false)
  let username = ''

  const todoRef = useRef()
  const usernameRef = useRef()
  const passwordRef = useRef()

  useEffect((_) => {
    import('webfontloader').then((WebFont) => {
      WebFont.load({
        google: {
          families: ['Inter:400,900'],
        },
      })
    })
  })

  const color = [
    'orange',
    'lightblue',
    'coral',
    'lightgreen',
    'lightyellow',
    'lightgray',
  ]
  const fontColor = [
    'brown',
    'darkblue',
    'lightred',
    'darkgreen',
    'orange',
    'black',
  ]

  function randomArrayIndex(arr) {
    return Math.floor(Math.random() * arr.length)
  }

  async function newTodo() {
    const colorIndex = randomArrayIndex(color)
    let todoItem = todoRef.current.value
    console.log(username)
    let newTodo = {
      content: todoItem,
      finished: false,
      username,
      colorIndex,
    }
    const resp = await post('/express/new', newTodo)
    let id = await resp.text()
    newTodo._id = id
    setTodos([...todos, newTodo])
    todoRef.current.value = ''
  }

  async function setFinished(index) {
    console.log(index)
    todos[index].finished = !todos[index].finished
    console.log(todos[index])
    if (!todos[index]._id) return
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
    await fetch(`/express/prune?username=${username}`)
    let newList = todos.filter((t) => !t.finished)
    setTodos(newList)
  }

  async function getTodos() {
    const resp = await fetch(`/express/todos?username=${username}`)
    const initialTodos = await resp.json()
    setTodos(initialTodos)
  }

  async function login() {
    let user = usernameRef.current.value
    let pwd = passwordRef.current.value
    let resp = await fetch(`/express/login?username=${user}&password=${pwd}`)
    if ((await resp.text()) == 'ok') username = usernameRef.current.value
    else alert('Wrong credentials')
    getTodos()
    setShowLogin(false)
  }

  return (
    <div>
      {showLogin ? (
        <div
          style={{ width: '100vw', height: '100vh' }}
          className="absolute flex justify-center items-center bg-black bg-opacity-50"
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-white flex flex-col gap-4 px-10 py-4 rounded-lg"
          >
            <h1 className="text-4xl font-bold text-center my-5">Login</h1>
            <label>
              Username:
              <input
                type="text"
                ref={usernameRef}
                className="border-2 border-black rounded-md px-2 py-3"
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                ref={passwordRef}
                className="border-2 border-black rounded-md px-2 py-3"
              />
            </label>
            <button
              className="bg-black text-white py-2 px-4 rounded-md"
              onClick={login}
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        ''
      )}
      <div
        onClick={(_) => setShowLogin(true)}
        className="absolute right-4 top-4 cursor-pointer p-3 border-2 border-black rounded-lg"
      >
        <FaUser />
      </div>

      <Head>
        <title>Todos | MERN</title>
      </Head>
      <h1 className="font-black text-center text-3xl my-4" onClick={getList}>
        todos
      </h1>
      <p className="text-center text-sm text-gray-700">
        The best way to manage your day.
      </p>
      <div className="flex gap-4 items-center justify-center my-20 mx-20 h-full">
        {todos.map((todo, index) => (
          <div
            onClick={(_) => setFinished(index)}
            style={{
              backgroundColor: color[todo.colorIndex],
              color: fontColor[todo.colorIndex],
              fontWeight: 900,
              opacity: todo.finished ? 40 : 100,
            }}
            className="px-4 py-2 rounded-lg hover:scale-110 cursor-pointer"
          >
            {todo.finished ? (
              <s>{todo.content}</s>
            ) : (
              <span>{todo.content}</span>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-0 rounded-lg fixed justify-center bottom-10 left-1/3"
      >
        {todos.some((t) => t.finished) ? (
          <button
            onClick={pruneList}
            className={`bg-green-800 text-white ${styles.btn} ${styles['btn-green']}`}
          >
            <FaCheck />
          </button>
        ) : (
          ''
        )}
        <input
          type="text"
          placeholder="Something important..."
          ref={todoRef}
          className="border-2 w-96 px-2 py-2 border-gray-700 rounded-lg"
        ></input>
        <button
          onClick={newTodo}
          type="submit"
          className={`${styles.btn} mx-0`}
        >
          <FaPlus />
        </button>
      </form>
    </div>
  )
}

Index.getInitialProps = async () => {
  const resp = await fetch(`http://localhost:6040/todos?username=`)
  const initialTodos = await resp.json()
  return {
    initialTodos,
  }
}
