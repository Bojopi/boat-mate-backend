import { response } from "express";
import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";

export const getCustomers = async (req, res = response) => {
    try {
        const customers = await Customer.findAll({
            attributes: [
                'id_customer',
                'customer_lat',
                'customer_lng',
                'customer_zip',
                'profile.id_profile',
                'profile.email',
                'profile.profile_state',
                'profile.person.person_name',
                'profile.person.lastname',
                'profile.person.phone',
            ],
            include: [{
                model: Profile,
                attributes: [],
                include: [{
                    model: Person,
                    attributes: []
                }]
            }],
            raw: true
        });

        res.status(200).json({customers});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getCustomer = async (req, res = response) => {
    const {idCustomer} = req.params;

    try {
        const customer = await Customer.findOne({
            where: {id_customer: idCustomer},
            attributes: [
                'id_customer',
                'customer_lat',
                'customer_lng',
                'customer_zip',
                'profile.id_profile',
                'profile.email',
                'profile.person.person_name',
                'profile.person.lastname',
                'profile.person.phone'
            ],
            include: [{
                model: Profile,
                attributes: [],
                include: [{
                    model: Person,
                    attributes: []
                }]
            }],
            raw: true
        });

        res.status(200).json({customer});
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

