const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001



morgan.token('body', function (request) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


//get all persons
app.get('/api/persons', (request, response) => {

    Person.find({}).then(persons => {
      response.json(persons)
    })
})

//find person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})


//delete person
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then( result => {
      response.status(204).end()
    })
})

//add person
app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  Person.findOne({ name: { $regex: `^${body.name}$`, $options: 'i' } })
  .then(foundPerson => {
    if(foundPerson) {
      response.status(409).json({error: 'name must be unique'})
    }
    else {
      const person = new Person({ name: body.name, number: String(body.number) })
      person.save()
      .then( savedPerson => {
        response.json(savedPerson)
      })
      .catch(error => next(error))
    }
})
})


//update person
app.put('/api/persons/:id', (request, response,next) => {
  body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

//info page
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id'})
  }

  if(error.name === 'ValidationError'){
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Server running on  port ${PORT}`)
})