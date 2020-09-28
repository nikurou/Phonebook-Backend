const express = require('express')
const app = express()

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
             '<span>' + new Date().getTime().toString() +'</span>')
    
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
    response.json(person)
  })


  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  //Uses NodeExpress and Nodemon