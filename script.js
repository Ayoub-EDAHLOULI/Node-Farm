const fs = require('fs');
const url = require('url');
const http = require('http');
const port = 5673;
const hostman = `127.0.0.1`;


const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')
const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const templateProdcuts = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')

const dataJson = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data.json`));

const replaceCarac = (item, target) => {
    let output = item.replace(/{%IMAGE%}/g, target.image)
    let organicStatus = target.organic ? "Organic" : "Not Organic";
    output = output.replace(/{%PRODUCTNAME%}/g, target.productName)
    output = output.replace(/{%ORGANIC%}/g, organicStatus)
    output = output.replace(/{%QUANTITY%}/g, target.quantity)
    output = output.replace(/{%PRICE%}/g, target.price)
    output = output.replace(/{%ID%}/g, target.id)

    return output
}

const replaceCaracPro = (item, target) => {
    let output = item.replace(/{%IMAGE%}/g, target.image)
    let organicStatus = target.organic ? "Organic" : "Not Organic";
    output = output.replace(/{%ORGANIC%}/g, organicStatus)
    output = output.replace(/{%PRODUCTNAME%}/g, target.productName)
    output = output.replace(/{%FROM%}/g, target.from)
    output = output.replace(/{%NUTRIENTS%}/g, target.nutrients)
    output = output.replace(/{%QUANTITY%}/g, target.quantity)
    output = output.replace(/{%PRICE%}/g, target.price)
    output = output.replace(/{%DESCRIPTION%}/g, target.description)

    return output
}



const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);
    if (pathname === '/' || pathname === '/overview') {
        let myCard = dataJson.map(item => replaceCarac(templateCard, item)).join('');
        const result = templateOverview.replace(/{%card%}/g, myCard);
        res.writeHead(200, {'Content-type' : 'text/html'});
        res.end(result)
    }else if(pathname === "/product"){
        res.writeHead(200, {'Content-type' : 'text/html'});
        const product = dataJson[query.id];
        const output = replaceCaracPro(templateProdcuts , product)
        res.end(output)
    }
})



server.listen(port, hostman, () => {
    console.log(`server is listning on port => http://${hostman}:${port}`);
});