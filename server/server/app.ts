import http, { IncomingMessage, Server, ServerResponse } from "http";
// import {getOrganization , getOrganizations, createOrganization, updateOrganization, deleteOrganization, deleteAll} from './databaseApi'
import { getOrganizations, getOrganization, createOrganization, updateOrganization, deleteOrganization, deleteOrganizations } from './controllers/organizationsController'
/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET" && req.url === '/') {
      getOrganizations(req, res);
    }
    if( req.method === 'GET' && req.url?.match(/\/\w+/)){
      const id = +req.url.split('/')[1];
      getOrganization(req, res, id)
    }
    if(req.method === 'POST') {
      createOrganization(req, res)
    }
    if(req.method === 'PUT' && req.url?.match(/\/\w+/)){
      const id = +req.url.split('/')[1];
      updateOrganization(req, res, id)
    }
    if(req.method === 'DELETE' && req.url?.match(/\/\w+/)){
      const id = +req.url.split('/')[1];
      deleteOrganization(req, res, id)
    }
    if(req.method === 'DELETE' && req.url === '/'){
      deleteOrganizations(req, res)
    }
  }
);

const PORT = 3006
// server.listen(3006);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));