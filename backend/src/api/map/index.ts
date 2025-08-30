import express from "express"
import { authenticateToken } from "middleware/auth";
import { getMap } from "./controller";


const router = express.Router();
router.use(authenticateToken);

console.log(process.env.PB_JWT_SECRET);



// Debug middleware for profile routes
router.use((req, res, next) => {
  console.log(`👥 Maps Route: ${req.method} ${req.path}`);
  next();
});


router.get('/', getMap);



export default router;