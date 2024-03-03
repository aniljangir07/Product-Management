import mongoose from 'mongoose';
import Product from '../model/product_model.js';
import resMessage from '../../constants/message.js';
import statusMsg from '../../constants/status.js';
import { LIMIT, SKIP } from '../../constants/variables.js';

export const getProductList = async (req,res,next) => {
      const limit = req.query.limit ? parseInt(req.query.limit) : LIMIT;
      const skip  = req.query.skip  ? parseInt(req.query.skip)  : SKIP;

      const filterProduct = req.query.product_name ? req.query.product_name: '';
      const regexPattern = new RegExp(filterProduct, 'i');

      const conditionObjects = {};
      if(filterProduct){
            conditionObjects.productName = { $regex: regexPattern }
      };
  
      try {
            const products = await Product.find(conditionObjects).sort({ created: -1 }).limit(limit).skip(skip);
            res.status(statusMsg.SUCCESS).json({products : products});
      } catch (error) {
            console.error('Error fetching product list:', error);
            res.status(statusMsg.ERROR).json({ error:  resMessage.INTERNAL_SERVER_ERR });
      };
};

export const createProduct = async (req,res)=>{
      try {
            const { productName, productType, productPrice, productShortDescription } = req.body;

            const existingProduct = await Product.findOne({ productName: productName });

            if (existingProduct) return res.status(statusMsg.BAD_REQUEST).json({ error: 'Product name must be unique' });
            
            // Create a new instance of the Product model
            const newProduct = new Product({
                  productName,
                  productType,
                  productPrice,
                  productShortDescription
            });

            newProduct["created"] = new Date();
            await newProduct.save();

            res.status(statusMsg.SUCCESS).json({ message: resMessage.PRODUCT_ADDED });
      } catch (error) {
            console.error('Error creating product:', error);
            if (error instanceof mongoose.Error.ValidationError) {
                  const validationErrors = {};
                  for (const field in error.errors) {
                        validationErrors[field] = error.errors[field].message;
                  }
                  return res.status(statusMsg.BAD_REQUEST).json({ errors: validationErrors });
            };
            res.status(statusMsg.ERROR).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};

export const updateProductStatus = async (req,res)=>{
      try {
            const { productId, status } = req.params;
            if(!mongoose.isValidObjectId(productId)){
                  res.status(status.BAD_REQUEST).json({error : resMessage.BAD_REQUEST})
            };

            const updatedProduct = await Product.findByIdAndUpdate(productId,{ status },{ new: true });

            if (!updatedProduct) return res.status(statusMsg.NOT_FOUND).json({ error: resMessage.PRODUCT_NOT_FOUND });

            updatedProduct["modified"] = new Date();

            await updatedProduct.save();

            res.status(statusMsg.SUCCESS).json(updatedProduct);
      } catch (error) {
            console.error('Error updating product status:', error);
            res.status(statusMsg.ERROR).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};

export const viewProduct = async (req,res)=>{   
      try {
            const { productId } = req.params;
            const product = await Product.findById(productId);

            if (!product) return res.status(statusMsg.NOT_FOUND).json({ error: resMessage.PRODUCT_NOT_FOUND });

            res.json(product);
      } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(statusMsg.ERROR).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};

export const editProductDetails = async (req, res) => {
      try {
            const { productId } = req.params;
            const { productName, productType, productPrice, productShortDescription } = req.body;

            const product = await Product.findById(productId);

            if (!product) return res.status(statusMsg.NOT_FOUND).json({ error: resMessage.PRODUCT_NOT_FOUND });

            if (productName) product.productName = productName;
            if (productType) product.productType = productType;
            if (productPrice) product.productPrice = productPrice;
            if (productShortDescription) product.productShortDescription = productShortDescription;
            product["modified"] = new Date();
            
            await product.save();

            res.status(statusMsg.SUCCESS).json(product);
      } catch (error) {
            console.error('Error editing product details:', error);
            res.status(statusMsg.BAD_REQUEST).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};

export const deleteProduct = async (req, res) => {
      try {
            const { productId } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(productId);

            if (!deletedProduct) return res.status(statusMsg.NOT_FOUND).json({ error: resMessage.PRODUCT_NOT_FOUND });

            res.status(statusMsg.SUCCESS).json({ message: resMessage.PRODUCT_DELETED });
      } catch (error) {
            console.error('Error deleting product:', error);
            res.status(statusMsg.BAD_REQUEST).json({ error: resMessage.INTERNAL_SERVER_ERR });
      };
};