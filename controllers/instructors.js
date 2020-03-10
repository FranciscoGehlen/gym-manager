const fs =  require('fs')
const data = require('../data.json')
const { age, date } = require('../useful')
const Intl = require('intl')

exports.index = function(req, res){
    return res.render('instructors/index', { instructors: data.instructors })
}

exports.create = function(req, res){
    return res.render('instructors/create')
}

exports.post = function(req, res){

    //get keys and put it in an array
    const keys = Object.keys(req.body)

    for (key of keys){
        if (req.body[key] == "") {
            return res.send('Please, fill all fields')
        }
    }

    let {avatar_url, birth, name, services, gender} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    let id = 1
    const lastInstructor = data.instructors[data.instructors.length - 1]
    
    if (lastInstructor) {
        id = lastInstructor.id + 1
    }

    

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 4), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })

    // return res.send(req.body)
}

exports.show = function(req, res){
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("Instructor not found")

    

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render("instructors/show", {instructor})
}

exports.edit = function(req, res){

    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor) return res.send("Instructor not found")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }
    
    return res.render('instructors/edit', { instructor })
}

exports.put = function (req, res){
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if(id == instructor.id){
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return res.send("Instructor not found")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data,null,4), function(err){
        if (err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })

}

exports.delete = function(req, res){
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data,null,4), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })
}