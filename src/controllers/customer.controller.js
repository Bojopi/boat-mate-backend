import { Customer } from "../models/Customer.js";
import { Person } from "../models/Person.js";
import { Profile } from "../models/Profile.js";
import { Provider } from "../models/Provider.js";
import { Service } from "../models/Service.js";
import { ServiceProviders } from "../models/ServiceProviders.js";

export const getServiceHistory = async (req, res) => {
    try {

        const serviceHistory = await ServiceProviders.findAll({
            attributes: ['id_service_provider', 'price', 'service.service_name', 'provider.provider_name', 'customers.profile.person.person_name', 'customers.profile.person.lastname', 'customers.contracts.date', 'customers.contracts.contract_state', 'customers.contracts.contract_description'],
            include: [
                {
                    model: Service,
                    attributes: []
                },
                {
                    model: Provider,
                    attributes: []
                },
                {
                    model: Customer,
                    attributes: [],
                    through: {
                        attributes: []
                    },
                    include: {
                        model: Profile,
                        attributes: [],
                        include: {
                            model: Person,
                            attributes: []
                        }
                    }
                }
            ],
            raw: true
        })
        res.status(200).json({ serviceHistory });
    } catch (error) {
        return res.status(400).json({msg: error.message});
    }
}

