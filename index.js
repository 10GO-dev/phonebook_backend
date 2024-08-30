const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on  port ${PORT}`)
})


morgan.token('body', function (request) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random()*500)
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if(person){
      response.json(person)
    }else{
      response.status(404).end() 
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    
    if(person){
      persons = persons.filter(p => p.id !== id)
      return response.status(204).end()
    }
    response.status(404).end()
    
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const nameExist = () => persons.some(p => p.name.toLowerCase() === body.name.toLowerCase())
  
  if(nameExist()){
    return response.status(409).json({
      error:'name must be unique'
    })
  }
  const person = { name: body.name, number: String(body.number), id: String(generateId()) }

  persons = persons.concat(person)
  response.json(person)

})

app.get('/api/info', (request, response) => {
    const date = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p>
    <br>
    <p>${date.toString()}</p>
    `
    response.send(info)
})


const unknownEndPoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndPoint)