import http, { IncomingMessage, Server, ServerResponse } from "http";
import fs from 'fs';
// import { getOrganizations, getOrganization } from './node_modules/databaseApi/index';
// const tryAgain = require('./node_modules/databaseApi/index');
// const {getOrganization , getOrganizations, createOrganization, updateOrganization, deleteOrganization, deleteAll} = require('./databaseApi');
import {getOrganization , getOrganizations, createOrganization, updateOrganization, deleteOrganization, deleteAll} from './databaseApi'
/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET" && req.url === '/') {
      if(getOrganizations() === undefined || getOrganizations().length < 1){
        res.end('No database entry made yet, kindly make a post first');
      }else{
        res.end(JSON.stringify(getOrganizations(), null, 4));
        // res.end(req);
        // res.end(JSON.stringify({ name: "hello" }));
      }
    }
    if( req.method === 'GET' && req.url?.match(/\/\w+/)){
        if(getOrganizations() === undefined){
            res.end('No database entry made yet, kindly make a post first');
        }else{
            const id = +req.url.split('/')[1];
            const organization = getOrganization(id)
            if(!organization){
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Organization Not Found' }))
            }else{
                res.end(JSON.stringify(organization, null, 4))
                // res.end(JSON.stringify(organization.updatedAt || 'Not updated', null, 4))
            }
        }
    }
    if(req.method === 'POST') {
      // const {organization, products, marketvalue} = req.body;
      // res.end('This is a post request');
      let body =  ''
      req.on('data', (chunk: any) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        const hhh = JSON.parse(body)
        const {organization, products, marketValue, address, ceo, country, noOfEmployees, employees} = JSON.parse(body)
        const organDetails = {
          organization,
          products: products || [],
          marketValue,
          address,
          ceo,
          country,
          noOfEmployees: employees.length || 0,
          employees: employees || []
        }
        const newOrgan = createOrganization(organDetails);
        res.end(JSON.stringify(newOrgan, null, 4));
      })
    }
    if(req.method === 'PUT' && req.url?.match(/\/\w+/)){
      if(getOrganizations() === undefined){
        res.end('No database entry made yet, kindly make a post first');
      }else{
        const id = +req.url.split('/')[1];
        const organiztion = getOrganization(id);
        if(!organiztion){
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Organization Not Found' }))
        }else{
          let body =  ''
          req.on('data', (chunk: any) => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const {organization, products, marketValue, address, ceo, country, noOfEmployees, employees} = JSON.parse(body)
            let newProducts;
            let newEmployees;
            if(products){
              organiztion.products.push(...products)
              newProducts = organiztion.products
            }else newProducts = organiztion.products
            if(employees){
              organiztion.employees.push(...employees)
              newEmployees = organiztion.employees
            }else newEmployees = organiztion.employees
            const organDetails = {
              organization: organization || organiztion.organization,
              products: newProducts,
              marketValue: marketValue || organiztion.marketValue,
              address: address || organiztion.address,
              ceo: ceo || organiztion.ceo,
              country: country || organiztion.country,
              noOfEmployees: newEmployees.length,
              employees: newEmployees
            }
            const updOrgan = updateOrganization(id, organDetails);
            res.end(JSON.stringify(updOrgan, null, 4));
          })
        }
      }
    }
    if(req.method === 'DELETE' && req.url?.match(/\/\w+/)){
      if(getOrganizations() === undefined){
        res.end('No database entry made yet, kindly make a post first');
      }else{
        const id = +req.url.split('/')[1];
        const organiztion = getOrganization(id);
        if(!organiztion){
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Organization Not Found' }))
        }else{
          deleteOrganization(id)
          res.end(`Organization ${id} deleted from database`)
        }
      } 
    }
    if(req.method === 'DELETE' && req.url === '/'){
      if(getOrganizations() === undefined || getOrganizations().length < 1){
        res.end('No database entry made yet, kindly make a post first');
      }else{
        deleteAll()
        res.end('All database entries deleted')
      }
    }
  }
);

// getOrganizations();
// getOrganization;

// testgetOrganizations();
// console.log(getOrganization(1));
// console.log(Array.isArray(testgetOrganizations()));
// console.log(getOrganizations());
const PORT = 3006
// server.listen(3006);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));