const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://nikurou:${password}@cluster0.dkutg.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnbedObject.id = returnedObject._id.toString() //returnobject.id is actually an object, so toJSON and toString it, then save
        delete returnedObject._id // MongoDB's generated v and id are not needed.
        delete returnedObject._v
    }
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

//If command consist of node mongo.js password, print all persons
const printAll = () => {
    Person.find({}).then(result=>{
        result.forEach(person=> {
            console.log(person)
        })
        mongoose.connection.close() //Make sure connection close is executed in the "THEN", if it's outside, it'll close connection before it's done.
    }).catch(error=> console.log(`An error occurred`))
    
}

if(person.name != undefined && person.number!= undefined){
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
}else{
    console.log('Printing all persons')
    printAll()
}
