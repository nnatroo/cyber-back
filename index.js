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
    const database = await connectToDatabase();
    const categoriesCollection = database.collection('test_data');
    const topCategories = await categoriesCollection.aggregate([
      { $match: { categoryName: { $ne: null } } },
      { $group: { _id: "$categoryName", itemCount: { $sum: 1 } } },
      { $sort: { itemCount: -1 } },
      { $limit: 6 },
      { $project: { categoryName: "$_id", itemCount: 1, _id: 0 } }
    ]).toArray();
    res.json(topCategories);

  } catch (err) {
    console.error('Error fetching top categories:', err);
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
      const newArrival = database.collection('test_data');
      const cursor = newArrival.find({isNewArrival : true});
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
      const discounts = database.collection('test_data');
      const cursor = discounts.find({ discount: true });
      const result = await cursor.toArray()

      res.json(result);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  }

  run().catch(console.dir);
});

app.get('/products/:category', async (req, res) => {
  const { category } = req.params;
  console.log(category)

  try {
    const db = await connectToDatabase();
    const products = db.collection('test_data');

    if (category === 'all') {
      const allData = await products.find().toArray();
        return res.json(allData);
    }

    const data = await products.find({ categoryName: category }).toArray();
    console.log(data)
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/payment', async (req, res) => {try {
    const database = await connectToDatabase();
    const payment_info = database.collection('payment_info');

    const doc = {
        cardName: req.body.cardName,
        cardNumber: req.body.cardNumber,
        cvv: req.body.cvv,
        expDate: req.body.expDate,
        createdAt: new Date(),
    };

    const result = await payment_info.insertOne(doc);
    res.json({ message: 'Payment saved', id: result.insertedId });
} catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
