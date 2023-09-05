import { response } from 'express';
import { Invoice } from '../models/Invoice';
import { nextOrderNumber } from '../helpers/nextOrderNumber';

export const createInvoice = async (req, res = response) => {
    const { idContract } = req.params;
    const {
        id,
        created,
        customer_details: {
            email,
            name
        },
        payment_status
    } = req.body;

    try {
        const orderNumber = nextOrderNumber();
        const invoice = await Invoice.create({
            id_invoice: id,
            invoice_date: created,
            invoice_state: payment_status,
            invoice_order: orderNumber,
            // invoice_service:
        })
    } catch (error) {
        
    }
}

export const updateInvoiceState = async (req, res = response) => {
    const { idInvoice } = req.params;
    const { state } = req.body;

    try {
        const invoice = await Invoice.update({
            invoice_state: state
        }, {
            where: {id_invoice: idInvoice},
            returning: true
        })
            
        res.status(200).json({
            msg: 'Invoice updated',
            invoice
        });

    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}