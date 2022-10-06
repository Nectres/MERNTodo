const express = require('express')
const { ObjectId, MongoClient } = require('mongodb')
const { createHash } = require('crypto')

const client = new MongoClient('mongodb://127.0.0.1:27017')

function hash(str) {
  return createHash('sha256').update(str).digest('hex')
}

async function main() {
  await client.connect()
  console.log('MongoDB Server connected')
  const demo = client.db('demo')
  const todos = demo.collection('todo')
  const users = demo.collection('users')

  const app = express()

  app.use(express.json())

  app.get('/ping', (req, res) => {
    res.send('Pong')
  })

  app.get('/login', async (req, res) => {
    let { username, password } = req.query
    const user = await users.findOne({ username })
    console.log({ pwd: hash(password) })
    if (!user) {
      let { acknowledged } = await users.insertOne({
        username,
        password: hash(password),
      })
      if (!acknowledged) return res.status(403).send('wrong')
      return res.send('created account')
    }
    if (hash(password) == user.password) {
      return res.send('ok')
    } else return res.send('wrong password')
  })

  app.get('/todos', async (req, res) => {
    let { username } = req.query
    console.log('Getting todos for username:', username)
    let initialTodos = await todos.find({ username }).toArray()
    console.log(initialTodos)
    res.json(initialTodos)
  })

  app.post('/new', async (req, res) => {
    let newtodo = req.body
    let result = await todos.insertOne(newtodo)
    if (result.acknowledged) res.send(result.insertedId.toHexString())
    else res.status(500).send(result)
  })

  app.get('/update', async (req, res) => {
    const { id, finished } = req.query
    console.log(id)
    let resp = await todos.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          finished: finished == 'true',
        },
      },
    )
    console.log(resp)
    if (resp.acknowledged) return res.send('ok')
    else {
      console.log(res)
      res.status(500).send('failed')
    }
  })

  app.get('/prune', async (req, res) => {
    let { username } = req.query
    let resp = await todos.deleteMany({
      finished: true,
      username,
    })
    console.log(resp)
    if (resp.acknowledged) res.send('ok')
    else res.status(500).send('failed')
  })

  app.listen(6040, () => {
    console.log('Server started')
  })
}

main().catch((err) => console.error(err))
