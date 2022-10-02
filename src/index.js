const express = require('express')
const { ObjectId, MongoClient } = require('mongodb')

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function main() {
  await client.connect()
  console.log('MongoDB Server connected')
  const demo = client.db('demo')
  const todos = demo.collection('todo')

  const app = express()

  app.use(express.json())

  app.get('/ping', (req, res) => {
    res.send('Pong')
  })

  app.get('/todos', async (req, res) => {
    let initialTodos = await todos.find().toArray()
    res.json(initialTodos)
  })

  app.post('/new', async (req, res) => {
    let newtodo = req.body
    let result = await todos.insertOne(newtodo)
    if (result.acknowledged) res.send('ok')
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
    let resp = await todos.deleteMany({
      finished: true,
    })
    console.log(resp);
    if (resp.acknowledged) 
        res.send("ok")
    else
        res.status(500).send("failed")
  })

  app.listen(6040, () => {
    console.log('Server started')
  })
}

main().catch((err) => console.error(err))
