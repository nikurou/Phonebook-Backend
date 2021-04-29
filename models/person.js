const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }, 
  id: String
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString() //returnobject.id is actually an object, so toJSON and toString it, then save
        delete returnedObject._id // MongoDB's generated v and id are not needed.
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)