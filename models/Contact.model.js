const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {name: String,
    email: String,
    message: String,
  },
);

const Contact = model("Contact", contactSchema);

module.exports = Contact;
