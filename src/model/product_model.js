import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
      productName: {
            type: String,
            required: [true, 'Product name is required'],
            minlength: [6, 'Product name must be at least 6 characters long'],
            unique: true, 
            uniqueCaseInsensitive: true,
            uniqueErrorMessage: 'Product name must be unique'
      },
      productType: {
            type: String,
            required: [true, 'Product type is required']
      },
      productPrice: {
            type: Number,
            required: [true, 'Product price is required']
      },
      productShortDescription: {
            type: String
      },
      status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
      },
      created: {
            type: Date,
      },
      modified: {
            type: Date,
      },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
