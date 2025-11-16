const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 4000;
// process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// console.log(process.env.USER_DB);

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.pdfyvmk.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const recipesCollection = client.db("assignment-10").collection("recipes");

    app.post("/recipes", async (req, res) => {
      const newRecipe = req.body;
      console.log(newRecipe);
      const result = await recipesCollection.insertOne(newRecipe);
      res.send(result);
    });

    app.get("/recipes", async (req, res) => {
      const result = await recipesCollection.find().toArray();
      res.send(result);
    });

    app.delete("/recipes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipesCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/recipes/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedRecipe = req.body;
      const updatedDoc = {
        $set: updatedRecipe,
      };
      const result = await recipesCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.get("/myRecipes", async (req, res) => {
      const email = req.query.email;
      const result = await recipesCollection
        .find({ userEmail: email })
        .toArray();
      res.send(result);
    });

    app.get("/recipes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipesCollection.findOne(query);
      res.send(result);
    });

    // GET top 6 recipes by like
    app.get("/topRecipes", async (req, res) => {
      try {
        const topRecipes = await recipesCollection
          .find({})
          .sort({ like: -1 }) 
          .limit(6) 
          .toArray();
        res.send(topRecipes);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assignment 10 server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
