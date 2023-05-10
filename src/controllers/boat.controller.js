import { response } from "express";
import { Boat } from "../models/Boat.js";
import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";

export const getAllBoats = async (req, res) => {
    try {
        const boats = await Boat.findAll({
            attributes: ['id_boat', 'type', 'model', 'brand', 'year', 'length', 'boat_lat', 'boat_lng', 'customer.profile.person.person_name', 'customer.profile.person.lastname'],
            include: {
                model: Customer,
                attributes: [],
                include: {
                    model: Profile,
                    attributes: [],
                    include: {
                        model: Person,
                        attributes: []
                    }
                }
            },
            raw: true,
            // order: [['customer.profile.person.person_name', 'ASC']]
        });
        res.status(200).json({ boats });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const getBoat = async (req, res = response) => {
    const {idBoat} = req.params;

    try {
        const boat = await Boat.findOne({
            where: {id_boat: idBoat},
            attributes: ['id_boat',
                        'type', 
                        'model', 
                        'brand',
                        'brand_motor',
                        'model_motor',
                        'year',
                        'length',
                        'boat_lat',
                        'boat_lng',
                        'customer.profile.person.person_name',
                        'customer.profile.person.lastname',
                        'customer.profile.person.phone'
                    ],
            include: [{
                model: Customer,
                attributes: [],
                include: [{
                    model: Profile,
                    attributes: [],
                    include: [{
                        model: Person,
                        attributes: []
                    }]
                }]
            }],
            raw: true
        });

        res.status(200).json({
            boat
        });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
};

export const updateBoat = async (req, res = response) => {
    const {idBoat} = req.params;
    const {
        type,
        model,
        brand,
        brandMotor,
        modelMotor,
        year,
        length,
        boatLat,
        boatLng
    } = req.body;

    let dataBoat = {};

    if(type != null && type != "")  dataBoat.type = type;
    if(model != null && model != "") dataBoat.model = model;
    if(brand != null && brand != "") dataBoat.brand = brand;
    if(brandMotor != null && brandMotor != "") dataBoat.brand_motor = brandMotor;
    if(modelMotor != null && modelMotor != "") dataBoat.model_motor = modelMotor;
    if(year != null && year != "") dataBoat.year = year;
    if(length != null && length != "") dataBoat.length = length;
    if(boatLat != null && boatLat != "") dataBoat.boat_lat = boatLat;
    if(boatLng != null && boatLng != "") dataBoat.boat_lng = boatLng;

    try {
        const updateBoat = await Boat.update(dataBoat, {where: {id_boat: idBoat}, returning: true});

        res.status(200).json({
            msg: 'Updated data',
            updateBoat
        });
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
};

export const deleteBoat = async (req, res = response) => {
    const {idBoat} = req.params;
    try {
        await Boat.destroy({where: {id_boat: idBoat}});
        res.status(200).json({msg: 'Successfully eliminated boat'})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }

};

export const getBoatsCustomerId = async (req, res = response) => {
    const {idCustomer} = req.params;

    try {
        const boats = await Boat.findAll({
            where: {customerId: idCustomer},
            attributes: ['id_boat', 'type', 'model', 'brand', 'brand_motor', 'model_motor', 'year', 'length', 'boat_lat', 'boat_lng'],
            order: ['brand']
        });

        res.status(200).json({boats})
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
};

export const createBoat = async (req, res = response) => {
    const {idCustomer} = req.params;
    const {
        type,
        model,
        brand,
        brandMotor,
        modelMotor,
        year,
        length,
        boatLat,
        boatLng,
    } = req.body;

    try {
        const boat = await Boat.create({
            type: type,
            model: model,
            brand: brand,
            brand_motor: brandMotor,
            model_motor: modelMotor,
            year: year,
            length: length,
            boat_lat: boatLat,
            boat_lng: boatLng,
            customerId: idCustomer
        }, {
            returning: true
        });

        res.status(200).json({ boat });
    } catch (error) {
        return res.status(400).json({msg: error.message})
    }
}