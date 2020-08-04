const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//SERVER
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const productsList = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  "utf-8"
);
const productsListObject = JSON.parse(productsList);

const server = http.createServer((req, res) => {
  const {query, pathname} = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const productsCardList = productsListObject
      .map((product) => replaceTemplate(templateCard, product))
      .join("");
      const output = templateOverview.replace(/%PRODUCT_CARD%/g, productsCardList)

    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    const product = productsListObject[query.id];

    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Conten-type": "application/json" });
    res.end(productsList);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "localhost");
