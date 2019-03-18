const mongoose = require("mongoose");

const { Schema } = mongoose;

const NotesSchema = new Schema({
  title: String,
  body: String,
  date: Date
});

mongoose.model("Notes", NotesSchema);
