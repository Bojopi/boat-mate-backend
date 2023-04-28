import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ServicePreferences = sequelize.define('service_preferences', {
    serviceId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'services',
            key: 'id_service'
        }
    },
    customerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'customers',
            key: 'id_customer'
        }
    },
}, {
    timestamps: false
});
