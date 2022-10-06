const mongoose = require('mongoose')

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demo')
  console.log('connected')
  const Todo = new mongoose.model("todo", {
    content: String,
    username: String,
  })
  const newTodo = new Todo({ content: "Hello world", useranme:"keerthivasan"});
  console.log(newTodo);
}

main().catch((err) => console.log(err))
