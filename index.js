require('dotenv').config() //This must be imported before the Person model, otherwise Person won't have an env variable or address to work off of.
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

var morgan = require('morgan')
const { response } = require('express')

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) //Console Logging format with Morgan
app.use(express.json()) //JSON PARSER
app.use(express.static('build')) //To make Express show static content, the index HTML and JS, etc. 
app.use(cors()) //Cross-Origin Resource Sharing (CORS) allows restricted resources on a webpage to be requested from another domain. 


//Info 
app.get('/api/info', (req, res) => {
  res.send('<span>Phonebook has info for ' + Person.length + ' people </span> <br/>' +
    '<span>' + new Date().toString() + '</span>')

})

//Fetching all resources
app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

//Fetching a single person resource
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        // Person not found
        response.status(404).end()
      }
    }).catch(error => next(error))
})

//Deleting a single phonebook entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end() //returns 204 no content after deletion
    })
    .catch(error => next(error))
})

//Adding new entry to MongoDB
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined && body.number === undefined) {
    return res.status(400).json({
      error: 'Name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

// Modifying an already existing entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

//Middleware for error and unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


