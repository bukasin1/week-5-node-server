import http, { IncomingMessage, Server, ServerResponse } from "http";
const request = require('request');
const cheerio = require('cheerio');
const needle = require('needle');
const axios = require('axios')
// import metaScrape from 'meta-data-scrapper';
const getMetaData = require('metadata-scraper');
const scrape = require('scrape-metadata');
const fs = require('fs');
/*
implement your server code here
*/

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      res.end(JSON.stringify({ name: "hello" }));
    }
    if(req.method === 'POST'){
      let body =  ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        const url = body.trim()
        // const url1 = "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States"

        axios.get(url)
          .then((resp: any) => {
            const webData = cheerio.load(resp.data)
            fs.writeFileSync('./index.html', resp.data)
            const pageTitle = webData('title').text()
            const description = webData('meta[name = "description"]').attr('content') || 'No page description'
            const writeStream = fs.createWriteStream(`./results/${pageTitle}-result.csv`)
            writeStream.write(`Title: ${pageTitle} \nDescription: ${description} \n`)
            const images = webData('img')
            const imgUrls: any[] = []
            writeStream.write('Images Url \n')
            images.each((i: any, el: any) => {
              const imgUrl = images[i].attribs.src
              imgUrls.push(images[i].attribs.src)
              writeStream.write(`${imgUrl} \n`)
            })
            // for (let i = 0; i < 46; i++) {
            //   const imgUrl = webData('img')[i].attribs.src
            //   writeStream.write(`${imgUrl} \n`)
            // }
            const scrappedData = {
              Title : pageTitle,
              Description : description,
              noOfImages : imgUrls.length,
              ImageUrls : imgUrls
            }

            res.end(`${url} done scrapping \n ${JSON.stringify(scrappedData, null, 4)}`)
            console.log('Scraping Done...');
          })
          .catch((err: any) => {
            res.end(`${url} is probably not complete or not valid, check again`)
          })

        // request.get(url, (err: any, res1: any, html: any) => {
        //   try{
        //     if(err){
        //       res.end(`${url} is not a valid url`)
        //     }
        //     if (!err && res1.statusCode == 200) {
        //       const webData = cheerio.load(html)
        //       fs.writeFileSync('./index.html', html)
        //       const pageTitle = webData('title').text()
        //       const description = webData('meta[name = "description"]').attr('content') || 'No page description'
        //       const writeStream = fs.createWriteStream(`./results/${pageTitle}-result.csv`)
        //       writeStream.write(`Title: ${pageTitle} \nDescription: ${description} \n`)
        //       const images = webData('img')
        //       const imgUrls: any[] = []
        //       writeStream.write('Images Url \n')
        //       images.each((i: any, el: any) => {
        //         const imgUrl = images[i].attribs.src
        //         imgUrls.push(images[i].attribs.src)
        //         writeStream.write(`${imgUrl} \n`)
        //       })
        //       // for (let i = 0; i < 46; i++) {
        //       //   const imgUrl = webData('img')[i].attribs.src
        //       //   writeStream.write(`${imgUrl} \n`)
        //       // }
        //       const scrappedData = {
        //         Title : pageTitle,
        //         Description : description,
        //         noOfImages : imgUrls.length,
        //         ImageUrls : imgUrls
        //       }
  
        //       res.end(`${url} done scrapping \n ${JSON.stringify(scrappedData, null, 4)}`)
        //       console.log('Scraping Done...');
        //     }else{
        //       res.end(`${url} is probably not complete, check again`)
        //     }
        //   }catch(err){
        //     console.log(err)
        //   }
        // })
      })
    }
  }
);

server.listen(3001, () => console.log(`Server running on port ${3001}`));
