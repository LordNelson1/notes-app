const router = require("express").Router();
const mongoose = require("mongoose");
const moment = require("moment");
const Notes = mongoose.model("Notes");

router.get("/", async (req, res) => {
  const response = await Notes.find({}).sort({ date: "desc" });

  res.json(response);
});

router.post("/new", async (req, res) => {
  const { title, body } = req.body.data;
  const date = moment().format();
  const note = {
    title,
    body,
    date
  };
  const finalNote = new Notes(note);
  await finalNote.save();
  res.json(200);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  await Notes.findByIdAndUpdate(id, req.body.data);
  res.json(200);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Notes.remove({ _id: id });
  res.json(200);
});

module.exports = router;
