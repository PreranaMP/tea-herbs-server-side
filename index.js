const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ec5rs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
 try {
  await client.connect();
  const database = client.db('teaHerbs');
  const productCollection = database.collection('products');
  const ordersCollection = database.collection('orders')

  // GET PRODUCTS API
  app.get('/products', async (req, res) => {
   const cursor = productCollection.find({});
   const products = await cursor.toArray();
   res.send(products);
  });

  // GET SINGLE PRODUCT
  app.get('/products/:id', async (req, res) => {
   const id = req.params.id;
   // console.log('getting one product', id)
   const query = { _id: ObjectId(id) }
   const product = await productCollection.findOne(query);
   res.json(product);
  });

  // GET ORDERS
  app.post('/orders', async (req, res) => {
   const order = req.body;
   const result = await ordersCollection.insertOne(order)
   console.log(result);
   res.json(result)
  })

 }
 finally {
  // await client.close();
 }
}

run().catch(console.dir);

app.get('/', (req, res) => {
 res.send('Running tea herbs Server');
});

app.listen(port, () => {
 console.log('Running tea herbs on', port);
})