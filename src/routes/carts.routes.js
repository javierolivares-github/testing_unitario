import { Router } from "express";

import { authorization, passportCall } from "../middlewares/passport.middleware.js";
import { checkProductAndCart } from "../middlewares/checkProductAndCart.middleware.js";
import cartsControllers from "../controllers/carts.controllers.js";
import { isUserCart } from "../middlewares/isUserCart.js";
const router = Router();

// CREATE A CART (ok)
router.post("/", passportCall("jwt"), authorization(["user", "premium"]), cartsControllers.createCart);

// GET A CART (ok)
router.get("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsControllers.getCartById);

// DELETE A CART (ok)
router.delete("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsControllers.deleteAllProductsInCart);

// GET A CART AND PURCHASE (ok)
router.get("/:cid/purchase", passportCall("jwt"), authorization(["user", "premium"]), cartsControllers.purchaseCart);


// ADD A PRODUCT TO CART 
router.post("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, isUserCart, cartsControllers.addProductToCart);

// UPDATE A PRODUCT FROM CART 
router.put(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization("user"),
  checkProductAndCart,
  cartsControllers.updateQuantityProductInCart
);

// DELETE A PRODUCT FROM CART 
router.delete("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, cartsControllers.deleteProductInCart);

export default router;