const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors())
const port = 8000

// const user = 'foodstore'
// const pass = 'foodstoredb'
// const dbName = 'foodstore'



const uri = 'mongodb+srv://foodstore:foodstoredb@cluster0.kcswx.mongodb.net/foodstore?retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const collection = client.db("foodstore").collection("food");
  const orderCollection = client.db("foodstore").collection("order");


  app.post('/addProduct', (req, res) => {
      const product = req.body;
      collection.insertOne(product)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })
    
  app.get('/delete/:id', (req, res) => {
      collection.deleteOne({_id : ObjectId(req.params.id)})
      .then( result => {
          res.send( result.deletedCount > 0)
      })
  })

  app.get('/product', (req, res) => {
      collection.find()
      .toArray( (err, documents) => {
         res.send(documents)
      })
  })

  app.get('/checkout/:id', (req, res) => {
     collection.find({_id : ObjectId(req.params.id)})
     .toArray( (err, documents) => {
         res.send(documents[0])
     })
  })

  app.post('/order', (req, res) => {
      const orderInfo = req.body;
      orderCollection.insertOne(orderInfo)
      .then( result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/orders', (req, res) => {
      orderCollection.find({email : req.query.email})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

});






app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(  process.env.PORT || port)
