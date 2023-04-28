import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Contract = sequelize.define('contracts', {
    serviceProviderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'service_providers',
            key: 'id_service_provider'
        }
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'customers',
            key: 'id_customer'
        }
    },
    date: {
        type: DataTypes.DATE,
    },
    contract_state: {
        type: DataTypes.STRING,
    },
    contract_description: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

