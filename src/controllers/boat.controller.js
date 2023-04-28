import { Boat } from "../models/Boat.js";
import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";

export const getAllBoats = async (req, res) => {
    try {
        const boats = await Boat.findAll({
            attributes: ['id_boat', 'type', 'model', 'brand', 'year', 'length', 'boat_position', 'customer.profile.person.person_name', 'customer.profile.person.lastname'],
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
}

