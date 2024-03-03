import { getProductList,createProduct,deleteProduct,editProductDetails,updateProductStatus,viewProduct } from "../controllers/product_controller.js";
import {Router} from "express";
import authenticateUser from '../middleware/auth.js'
const router = Router();

//Listing product details
router.get('/list',getProductList);

//Add new product
// router.post('/add',authenticateUser,createProduct);
router.post('/add',createProduct);

//For updating product status
// router.put('/update-status/:productId/:status',authenticateUser,updateProductStatus);
router.put('/update-status/:productId/:status',updateProductStatus);

//View product details
router.get('/view/:productId',viewProduct);

//For updating product details
// router.put('/update/:productId',authenticateUser,editProductDetails);
router.put('/update/:productId',editProductDetails);

//For deleting product
// router.delete('/delete/:productId',authenticateUser,deleteProduct);
router.delete('/delete/:productId',deleteProduct);


export default router;