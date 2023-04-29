const { Schema, model } = require("mongoose");

const coverLetterSchema = new Schema(
  {title: String,
    description: String,
    letter: String 
  },
);

const CoverLetter = model("CoverLetter", coverLetterSchema);

module.exports = CoverLetter;
