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
  res.json({ message: "List of clients obtained succefully!", data: clients });
});

// ********************* Find a client *********************
app.get("/clients/:id", async (req, res) => {
  const _id = req.params.id;
  // *** Validation ***
  try {
    const client = await Client.findOne({ _id });
    res.json({ message: "Client obtained succefully!", data: client });
  } catch (error) {
    // *** Handle error ***
    res.send({
      message: "The client could not be found. Invalid client ID.",
      error: error.message,
    });
  }
});

// ******************* Add a new client *******************
app.post("/clients", async (req, res) => {
  const newClient = new Client(req.body);
  // *** Validation ***
  try {
    await Client.insertMany(newClient);
    res.json({ message: "New client added succefully!", data: newClient });
  } catch (error) {
    // *** Handle error ***
    res.send({ message: "Couldn't add a new client.", error: error.message });
  }
});

// ******************** Update a client ********************
app.put("/clients/:id", async (req, res) => {
  const _id = req.params.id;
  const editClient = new Client({ _id, ...req.body });
  // *** Validation ***
  try {
    const result = await Client.findOneAndUpdate({ _id }, editClient);
    res.json({ message: "Client updated succefully!", data: editClient });
  } catch (error) {
    // *** Handle error ***
    res.send({
      message: "The client could not be updated.",
      error: error.message,
    });
  }
});

// ******************** Delete a client ********************
app.delete("/clients/:id", async (req, res) => {
  const _id = req.params.id;
  // *** Validation ***
  try {
    const result = await Client.deleteOne({ _id });
    res.json({ message: "Deleted client succefully!", data: result });
  } catch (error) {
    // *** Handle error ***
    res.json({
      message: "The client could not be deleted. Invalid client ID.",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
