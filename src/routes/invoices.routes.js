import { Router } from "express";
import { createInvoice } from "../controllers/invoice.controller";

const router = Router();

router.get('/create-invoice', createInvoice);

export default router;