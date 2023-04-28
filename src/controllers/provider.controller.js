import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";

export const getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.findAll({
            attributes: ['id_provider', 'provider_name', 'provider_description', 'zip', 'provider_image', 'profile.email', 'profile.person.phone'],
            include: {
                model: Profile,
                attributes: [],
                include: {
                    model: Person,
                    attributes: []
                },
            },
            raw: true
        });
        res.status(200).json({ providers });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

