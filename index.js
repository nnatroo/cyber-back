import express from "express";
import cors from "cors";
import {connectToDatabase} from "./services/database.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.get('/', async (req, res) => {
  async function run() {
    try {
      const database = await connectToDatabase();
      res.json({status: "Server is running!"});
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }
  run().catch(console.dir);
});

app.get('/menus/navbarItems', async (req, res) => {
  async function run() {
    try {
      const database = await connectToDatabase();
      const navbarItems = database.collection('navbar_items');
      const cursor = navbarItems.find();
      const result = await cursor.toArray()
      res.json(result);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }
  run().catch(console.dir);
});

app.get('/categories', async (req, res) => {
  try {
    const { categoryName } = req.query;
    const database = await connectToDatabase();
    const categoriesCollection = database.collection('categories');

    let filter = {};
    if (categoryName) {
      filter = { category: categoryName };
    }

    const categories = await categoriesCollection.find(filter, { projection: { category: 1, ImageSrc: 1 } }).toArray();

    res.json(categories);
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.get('/products/smartphones', async (req, res) => {
  async function run() {
    try {
      const database = await connectToDatabase();
      const productSmartphones = database.collection('productSmartphones');
      const cursor = productSmartphones.find();
      const result = await cursor.toArray()
      res.json(result);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }

  run().catch(console.dir);
});

app.get('/products/newArrival', async (req, res) => {
  async function run() {
    try {
      const database = await connectToDatabase();
      const newArrival = database.collection('new_arrival');
      const cursor = newArrival.find();
      const result = await cursor.toArray()

      res.json(result);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }

  run().catch(console.dir);
});

app.get('/products/discounts', async (req, res) => {
  async function run() {
    try {
      const database = await connectToDatabase();
      const discounts = database.collection('discounts');
      const cursor = discounts.find();
      const result = await cursor.toArray()

      res.json(result);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }

  run().catch(console.dir);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
