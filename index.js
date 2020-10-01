const { response } = require('express')
const express = require('express')
const app = express()

var morgan = require('morgan')

morgan.token('body', function (req){
  return JSON.stringify(req.body)
})

//In order to access data needed for adding new entry, we need this json-parser.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

//Info 
app.get('/api/info', (req, res) => {
    res.send('<span>Phonebook has info for ' +  persons.length + ' people </span> <br/>' +
             '<span>' + new Date().toString() +'</span>')
    
  })
  
//Fetching all resources
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//Fetching a single person resource
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('id is : ' + id)
    const person = persons.find(element => { return element.id === id})
    console.log(person)

    //If an entry for the given id is not found, the server has to respond with the appropriate status code.
    if(person){
        response.json(person)
    } else{
        response.status(404).end()
    }
  })

  //Deleting a single phonebook entry
  app.delete('/api/persons/:id', (req, res) => {
      const id = Number(req.params.id)
      persons = persons.filter(element => element.id !== id)

      //Even if the resource didn't originally exist, there's no consensus on what code should be returned
      //so in both cases, let's just return 204.
      response.status(204).end()
  })

  const generateID = () => {
    const Id = persons.length > 0 ? Math.max(...persons.map(ele => ele.id))+1: 0
    return Id
  }

  //Adding new entry 
  app.post('/api/persons', (req, res) => {
      const body = req.body
      const nameFilter = persons.map(ele => ele.name)

      //Error Handling if NAME or NUMBER is missing, OR NAME already exists
      if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'Name or Number is missing' 
        })
      } if(nameFilter.includes(body.name)){
        return res.status(400).json({ 
            error: 'name must be unique' 
          })
      }

      const person = {
        name : body.name,
        number: body.number,
        id : generateID(),
      }
      
      persons = persons.concat(person)
      
      res.json(person)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  //Uses NodeExpress and Nodemon

