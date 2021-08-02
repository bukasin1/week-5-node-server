const fs = require('fs')
// import fs from 'fs';
let organizations: any;

try{

    organizations = require('./data/database.json')
    // organizations = require('../data/test1.json')

}catch(err){
    console.log(err)
}
function getOrganizations(){
    return organizations;
}

function getOrganization(id: number){
    try {
        const organization = organizations.find((organization: any) => organization['id'] === id)
        return organization;
    }catch (err){
        console.log(err)
    }
}

function createOrganization(organization: any){
    const date = new Date()
    let newOrgan
    if(!organizations || organizations.length < 1){
        const id = 1;
        newOrgan = {id: id, createdAt: date, ...organization}
        organizations = [newOrgan]
    }else{
        const lastIndex = organizations.length - 1
        const id = organizations[lastIndex].id + 1
        newOrgan = {id: id, createdAt: date, ...organization}
        organizations.push(newOrgan)
    }
    // const writeStream = fs.createWriteStream('./data/test1.json')
    const writeStream = fs.createWriteStream('./lib/data/database.json')
    // fs.writeFileSync('./data/database.json', JSON.stringify(organizations, null, 4));
    writeStream.write(JSON.stringify(organizations, null, 4));
    writeStream.end()
    return newOrgan;
}

function updateOrganization(id: number, newOrganDetails: any){
    const date = new Date()
    let newOrgan
    const index = organizations.findIndex((organization: any) => organization['id'] === id)
    const createdDate = organizations[index].createdAt
    organizations[index] = {id: id, createdAt: createdDate, updatedAt: date, ...newOrganDetails}
    // const writeStream = fs.createWriteStream('./data/test1.json')
    const writeStream = fs.createWriteStream('./lib/data/database.json')
    // fs.writeFileSync('./data/database.json', JSON.stringify(organizations, null, 4));
    writeStream.write(JSON.stringify(organizations, null, 4));
    writeStream.end()
    return organizations[index];
}

function deleteOrganization(id: number){
    organizations = organizations.filter((o: any) => o['id'] !== id)
    // const writeStream = fs.createWriteStream('./data/test1.json')
    const writeStream = fs.createWriteStream('./lib/data/database.json')
    writeStream.write(JSON.stringify(organizations, null, 4));
    writeStream.end()
    return;
}

function deleteAll(){
    organizations = []
    // const writeStream = fs.createWriteStream('./data/test1.json')
    const writeStream = fs.createWriteStream('./lib/data/database.json')
    writeStream.write(JSON.stringify(organizations, null, 4));
    writeStream.end()
    return;
}

const date = new Date()
// console.log(date)

export {getOrganization, getOrganizations, createOrganization, updateOrganization, deleteOrganization, deleteAll};