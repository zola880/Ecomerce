import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add category'],
      enum: ['Furniture', 'Lighting', 'Decor', 'Lifestyle'],
    },
    image: {
      type: String,
      required: [true, 'Please add image URL'],
    },
    images: [String], // gallery images
    description: {
      type: String,
      required: [true, 'Please add description'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 10,
    },
    dimensions: {
      height: String,
      width: String,
      depth: String,
    },
    material: String,
    brand: String,
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;