const express = require('express')
//const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
//app.use(cors())

morgan.token('person', function (req, response) { 
  return `${JSON.stringify(req.body)}` })

let morgn = morgan(':method :url :status - :response-time ms :req[header] :person')

app.use(morgn)


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

// muestra el numero de contacto y cuando se consulto
app.get('/info', (request, response) => {
    let entradas = persons.length
    const fecha = new Date()
    response.send(`
    <p>Phonebook has info for ${entradas} people</p>
    <p>${fecha} </p>
    `)
    //console.log(fecha);
})

// muestrar los contactos
app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

//muestrar contacto por el id
app.get('/api/persons/:id', (request, response)=>{
    const id = Number( request.params.id)
    //console.log('id: ',id);
    const person = persons.find(x => x.id === id )
    //console.log(person);
    if (person) {
        response.json(person)
    }
    else{
        response.status(404).send()
    }
} )

//borrar un contecto
app.delete('/api/persons/:id',(request,response)=>{
  const id = Number(request.params.id)
  let size = persons.length
  persons = persons.filter(x => x.id !== id)

  if (size > persons.length) {
    response.status(204).send()
  }
  else{
    response.status(404).send()
  }
})

//generar un id
const generateId = () => {
  const maxId = persons.length > 0
      ? Math.max(...persons.map(x => x.id))
      : 0
  return maxId + 1
}

//agregar una entrada
app.post('/api/persons',(request, response) => {
  const body = request.body;
  //console.log('body', body)
  //si falta el  nombre
  if (!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }
  // si falta el numero
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  //si el nombre ya existe
  const coincidecia = persons.some( persons => persons.name === body.name)
  if (coincidecia) {
    return response.status(400).json({
      error: 'name must be unique '
    })
  }

  const person = {
      name: body.name,
      number : body.number,
      id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})

//actulizar un contacto existente

app.put('/api/persons/:id' ,(request,response) => {
  const id = Number( request.params.id)
    //console.log('id: ',id);
    const person = persons.find(x => x.id === id )
    //console.log(person);

    const body = request.body
    const personUpdate = {
      name: body.name,
      number : body.number,
      id: body.id
  }
    if (person) {
      persons = persons.map( x => x.id !== id ? x : personUpdate)
      response.json(personUpdate)
    }
    else{
        response.status(404).send()
    }
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})