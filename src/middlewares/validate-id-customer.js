import { Customer } from "../models/Customer.js";

export const validateIdCustomer = async(req, res, next) => {
    const {idCustomer} = req.params

    if (!idCustomer){ 
        return res.status(400).json({
            error: "You must provide a customer id"
        })
    }

    const customer = await Customer.findOne({where: {id_customer: idCustomer}})

    if(!customer){ 
        return res.status(400).json({
            error: "customer id invalid"
        })
    }

    req.customer = customer
    next()
}