const fs = require('fs')

let organizationsModel: any;

try{
    organizationsModel = require('../../data/test1.json')
}catch(err){
    console.log(err)
}

function getAll(){
    return new Promise((resolve, reject) => {
        resolve(organizationsModel)
    })
}

function getById(id: number){
    let organization: any
    return new Promise((resolve, reject) => {
        if(organizationsModel){
            organization = organizationsModel.find((organization: any) => organization['id'] === id)
            organization
            resolve(organization)
        }else{
            resolve(organization)
            console.log(organization)
        }
    })
}

function create(organization: any){
    return new Promise((resolve, reject) => {
        const date = new Date()
        let newOrgan
        if(!organizationsModel || organizationsModel.length < 1){
            const id = 1;
            newOrgan = {id: id, createdAt: date, ...organization}
            organizationsModel = [newOrgan]
        }else{
            const lastIndex = organizationsModel.length - 1
            const id = organizationsModel[lastIndex].id + 1
            newOrgan = {id: id, createdAt: date, ...organization}
            organizationsModel.push(newOrgan)
        }
        const writeStream = fs.createWriteStream('./data/test1.json')
        writeStream.write(JSON.stringify(organizationsModel, null, 4));
        writeStream.end()
        resolve(newOrgan);
    })
}

function update(id: number, newOrganDetails: any){
    return new Promise((resolve, reject) => {
        const date = new Date()
        let newOrgan
        const index = organizationsModel.findIndex((organization: any) => organization['id'] === id)
        const createdDate = organizationsModel[index].createdAt
        organizationsModel[index] = {id: id, createdAt: createdDate, updatedAt: date, ...newOrganDetails}
        const writeStream = fs.createWriteStream('./data/test1.json')
        writeStream.write(JSON.stringify(organizationsModel, null, 4));
        writeStream.end()
        resolve(organizationsModel[index]);
    })
}

function deleteById(id: number){
    return new Promise((resolve, reject) => {
        organizationsModel = organizationsModel.filter((o: any) => o['id'] !== id)
        const writeStream = fs.createWriteStream('./data/test1.json')
        writeStream.write(JSON.stringify(organizationsModel, null, 4));
        writeStream.end()
        resolve(null);
    })
}

function deleteAll(){
    return new Promise((resolve, reject) => {
        organizationsModel = []
        const writeStream = fs.createWriteStream('./data/test1.json')
        writeStream.write(JSON.stringify(organizationsModel, null, 4));
        writeStream.end()
        resolve(null);
    })
}

// async function test(){
//     console.log(await getById(1))
//     console.log(await getAll())
// }

// test()

export {getAll, getById, create, update, deleteById, deleteAll}