import express from "express";
import mapRoutes from "./map";

const router = express.Router();


router.use('/map', mapRoutes);


export default router;