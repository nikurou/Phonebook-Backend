require('dotenv').config() //This must be imported before the Person model, otherwise Person won't have an env variable or address to work off of.
const express = require('express')
const app = express()
const cors = require('cors') 
const Person = require('./models/person')

var morgan = require('morgan')
const { response } = require('express')

morgan.token('body', function (req){
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) //Console Logging format with Morgan
app.use(express.json()) //JSON PARSER
app.use(express.static('build')) //To make Express show static content, the index HTML and JS, etc. 
app.use(cors()) //Cross-Origin Resource Sharing (CORS) allows restricted resources on a webpage to be requested from another domain. 

let persons = []

//Info 
app.get('/api/info', (req, res) => {
    res.send('<span>Phonebook has info for ' +  persons.length + ' people </span> <br/>' +
             '<span>' + new Date().toString() +'</span>')
    
  })
  
//Fetching all resources
app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
      res.json(person)
    })
})

//Fetching a single person resource
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    }).catch(error =>response.status(404).end())
})

  //Deleting a single phonebook entry
  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(element => element.id !== id)

    //Even if the resource didn't originally exist, there's no consensus on what code should be returned
    //so in both cases, let's just return 204.
    res.status(204).end()

    console.log(`AFTER DELETING: ${persons}`)
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
        name : body.name,
        number: body.number,
      })
      
      person.save().then(savedPerson => {
        res.json(savedPerson)
      })
  })
  
  const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  //Uses NodeExpress and Nodemon

