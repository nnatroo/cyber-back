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
  try {
    const db = await connectToDatabase();
    const collection = db.collection('products');

    const newArrivals = await collection.aggregate([
      {
        $project: {
          arrayField: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      {
        $unwind: "$arrayField"
      },
      {
        $match: {
          "arrayField.v": { $type: "array" }
        }
      },
      {
        $unwind: "$arrayField.v"
      },
      {
        $match: {
          "arrayField.v.isNewArrival": true
        }
      },
      {
        $replaceRoot: {
          newRoot: "$arrayField.v"
        }
      }
    ]).toArray();

    res.json(newArrivals);
  } catch (err) {
    console.error("Error fetching new arrivals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/products/discounts', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('products');

    const discounts = await collection.aggregate([
      {
        $project: {
          arrayField: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      {
        $unwind: "$arrayField"
      },
      {
        $match: {
          "arrayField.v": { $type: "array" }
        }
      },
      {
        $unwind: "$arrayField.v"
      },
      {
        $match: {
          "arrayField.v.isDiscounted": true
        }
      },
      {
        $replaceRoot: {
          newRoot: "$arrayField.v"
        }
      }
    ]).toArray();

    res.json(discounts);
  } catch (err) {
    console.error("Error fetching discounts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/products/related', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('products');

    const related = await collection.aggregate([
      {
        $project: {
          arrayField: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      {
        $unwind: "$arrayField"
      },
      {
        $match: {
          "arrayField.v": { $type: "array" }
        }
      },
      {
        $unwind: "$arrayField.v"
      },
      {
        $match: {
          "arrayField.v.isRelated": true
        }
      },
      {
        $replaceRoot: {
          newRoot: "$arrayField.v"
        }
      }
    ]).toArray();

    res.json(related);
  } catch (err) {
    console.error("Error fetching related products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/products/item/:name', async (req, res) => {
  const productName = decodeURIComponent(req.params.name).trim().toLowerCase();

  try {
    const db = await connectToDatabase();
    const collection = db.collection('products');

    const match = await collection.aggregate([
      {
        $project: {
          arrayField: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      {
        $unwind: "$arrayField"
      },
      {
        $match: {
          "arrayField.v": { $type: "array" }
        }
      },
      {
        $unwind: "$arrayField.v"
      },
      {
        $addFields: {
          productNameLower: {
            $toLower: { $trim: { input: "$arrayField.v.name" } }
          }
        }
      },
      {
        $match: {
          productNameLower: productName
        }
      },
      {
        $replaceRoot: {
          newRoot: "$arrayField.v"
        }
      },
      {
        $limit: 1
      }
    ]).toArray();

    if (match.length > 0) {
      res.json(match[0]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/products/phones', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const products = db.collection('products');
        const data = await products.findOne({ name: 'Phones' });
        res.json(data.Phone);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/products/Cameras', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const products = db.collection('products');
        const data = await products.findOne({ name: 'cameras' });
        res.json(data.cameras);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/products/Smart%20Watches', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const data = await products.findOne({ name: 'watches' });
    res.json(data.watches);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/products/Headphones', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const data = await products.findOne({ name: 'headphones' });
    res.json(data.headphones);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/products/Gaming', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const data = await products.findOne({ name: 'gaming' });
    res.json(data.gaming);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/products/Computers', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const products = db.collection('products');
    const data = await products.findOne({ name: 'Computers' });
    res.json(data.Computers);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

