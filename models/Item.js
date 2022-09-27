const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    default: "Indonesia",
  },
  city: {
    type: String,
    required: true,
  },
  isPopular: {
    type: Boolean,
  },
  description: {
    type: String,
    required: true,
  },
  imageIds: [
    {
      type: ObjectId,
      ref: "Image",
    },
  ],
  categoryId: {
    type: ObjectId,
    ref: "Category",
  },
  featureIds: [
    {
      type: ObjectId,
      ref: "Feature",
    },
  ],
  activityIds: [
    {
      type: ObjectId,
      ref: "Activity",
    },
  ],
});

module.exports = mongoose.model("Item", itemSchema);
