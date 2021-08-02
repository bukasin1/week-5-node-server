const Organizations = require('../model/organization')

// console.log(Organizations.getAll())

async function getOrganizations(req: any, res: any) {
    try{
        const organizations = await Organizations.getAll()
        if(organizations === undefined || organizations.length < 1){
            res.end('No database entry made yet, kindly make a post first');
        }else{
            res.end(JSON.stringify(organizations, null, 4));
        }
    }catch (err) {
        console.log(err)
    }
}

async function getOrganization(req: any, res: any, id: number) {
    try{
        const organizations = await Organizations.getAll()
        const organization = await Organizations.getById(id)
        if(organizations === undefined){
            res.end('No database entry made yet, kindly make a post first');
        }else{
            if(!organization){
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Organization Not Found' }))
            }else{
                res.end(JSON.stringify(organization, null, 4))
            }
        }
    }catch (err) {
        console.log(err)
    }
}

async function createOrganization(req: any, res: any){
    try{
        let body =  ''
        req.on('data', (chunk: any) => {
          body += chunk.toString()
        })
        req.on('end', async () => {
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
          const newOrgan = await Organizations.create(organDetails);
          res.end(JSON.stringify(newOrgan, null, 4));
        })
    }catch (err) {
        console.log(err)
    }
}

async function updateOrganization(req: any, res: any, id: number){
    try{
        const organizations = await Organizations.getAll()
        const organiztion = await Organizations.getById(id)
        if(organizations === undefined){
            res.end('No database entry made yet, kindly make a post first');
        }else{
            if(!organiztion){
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Organization Not Found' }))
            }else{
                let body =  ''
                req.on('data', (chunk: any) => {
                    body += chunk.toString()
                })
                req.on('end', async () => {
                    const {organization, products, marketValue, address, ceo, country, employees} = JSON.parse(body)
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
                    const updOrgan = await Organizations.update(id, organDetails);
                    res.end(JSON.stringify(updOrgan, null, 4));
                })
            }
        }
    }catch (err) {
        console.log(err)
    }
}

async function deleteOrganization(req: any, res: any, id: number){
    try{
        const organizations = await Organizations.getAll()
        const organiztion = await Organizations.getById(id)
        if(organizations === undefined){
            res.end('No database entry made yet, kindly make a post first');
          }else{
            if(!organiztion){
              res.writeHead(404, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ message: 'Organization Not Found' }))
            }else{
              await Organizations.deleteById(id)
              res.end(`Organization ${id} deleted from database`)
            }
          } 
    }catch (err) {
        console.log(err)
    }
}

async function deleteOrganizations(req: any, res: any) {
    try{
        const organizations = await Organizations.getAll()
        if(organizations === undefined || organizations.length < 1){
            res.end('No database entry made yet, kindly make a post first');
          }else{
            await Organizations.deleteAll()
            res.end('All database entries deleted')
          }
    }catch (err) {
        console.log(err)
    }
}

export { getOrganizations, getOrganization, createOrganization, updateOrganization, deleteOrganization, deleteOrganizations }