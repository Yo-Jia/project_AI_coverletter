const { Schema, model } = require("mongoose");

const coverLetterSchema = new Schema(
  {jobTitle: String,
    jobDescription: String,
    coverLetter: String,
    public: Boolean
  },
);

const CoverLetter = model("CoverLetter", coverLetterSchema);

module.exports = CoverLetter;
