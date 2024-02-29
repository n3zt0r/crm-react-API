import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import "dotenv/config";

const { Schema, model } = mongoose;
const app = express();
const port = process.env.port || 3000;
const dataBaseURI = process.env.MONGODB_URI;

// ****************** Database connection ******************
mongoose.connect(dataBaseURI);

// ********************* Client Schema *********************
const errorMessageSchema = "Insert a valid property";
const client = new Schema({
  name: {
    type: String,
    required: [true, errorMessageSchema],
  },
  phone: {
    type: Number,
    required: [true, errorMessageSchema],
  },
  email: {
    type: String,
    required: [true, errorMessageSchema],
  },
  company: {
    type: String,
    required: [true, errorMessageSchema],
  },
  notes: {
    type: String,
  },
});
const Client = model("Clients", client);
// ********************************************************

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Welcome to my API. Nestor López");
});

// ***************** Get a list of clients *****************
app.get("/clients", async (req, res) => {
  const clients = await Client.find();

  console.log(`List of clients obtained succefully!`);
  res.json(clients);
});

// ********************* Find a client *********************
app.get("/clients/:id", async (req, res) => {
  const _id = req.params.id;

  // *** Validation ***
  try {
    const client = await Client.findOne({ _id });

    console.log(`Client obtained succefully!`);
    res.json(client);
  } catch (error) {
    // *** Handle error ***
    console.log(`Find client error: ${error.message}`);
    res.send(`Find client error: ${error.message}`);
  }
});

// ******************* Add a new client *******************
app.post("/clients", async (req, res) => {
  const newClient = new Client(req.body);

  // *** Validation ***
  try {
    await Client.insertMany(newClient);

    console.log(`New client added succefully!`);
    res.json(newClient);
  } catch (error) {
    // *** Handle error ***
    console.log(`Add new client error: ${error.message}`);
    res.send(`Add new client error: ${error.message}`);
  }
});

// ******************** Update a client ********************
app.put("/clients/:id", async (req, res) => {
  const _id = req.params.id;
  const editClient = new Client({ _id, ...req.body });

  // *** Validation ***
  try {
    const result = await Client.findOneAndUpdate({ _id }, editClient);

    if (result) {
      console.log(`Updated client succefully!`);
      res.json(editClient);
    } else {
      // *** Handle error ***
      console.log("Error: Client not found.");
      res.send("Error: Client not found.");
    }
  } catch (error) {
    // *** Handle error ***
    console.log(`Update client error: ${error.message}`);
    res.send(`Update client error: ${error.message}`);
  }
});

// ******************** Delete a client ********************
app.delete("/clients/:id", async (req, res) => {
  const _id = req.params.id;
  const result = await Client.deleteOne({ _id });

  // *** Validation ***
  if (result.deletedCount > 0) {
    console.log(`Deleted client succefully!`);
    res.json(`Deleted client succefully!`);
  } else {
    // *** Handle error ***
    console.log("Error: Client not found.");
    res.send("Error: Client not found.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
