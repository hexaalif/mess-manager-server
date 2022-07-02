const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agaitrv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toDoCollection = client.db("messManager").collection("toDo");

    app.get("/toDo", async (req, res) => {
      const query = {};
      const cursor = toDoCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.post("/addToDo", async (req, res) => {
      const data = req.body;
      const result = await toDoCollection.insertOne(data);
      res.send(result);
    });
  } finally {
    // it's finally
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from manager");
});

app.listen(port, () => {
  console.log(`manager app listening on port ${port}`);
});
