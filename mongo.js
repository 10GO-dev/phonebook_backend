const { default: mongoose } = require("mongoose");

if(process.argv.length<3){
    console.log('give password as argument')
}

const password = process.argv[2]

const url = `mongodb+srv://back_login:${password}@cluster0.5u0sape.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = new mongoose.model('Person',personSchema)

if(process.argv.length>3){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}else {
    Person.find({}).then(result => {
        if(result){
            console.log("phonebook:")
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            });    
        }
        mongoose.connection.close()
    })
}


