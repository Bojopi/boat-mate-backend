import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Boat } from './Boat.js'
import { Service } from "./Service.js";
import { ServicePreferences } from "./ServicePreferences.js";
import { Rating } from "./Rating.js";
import { ServiceProviders } from "./ServiceProviders.js";
import { Contract } from "./Contract.js";

export const Customer = sequelize.define('customers', {
    id_customer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customer_lat: {
        type: DataTypes.STRING
    },
    customer_lng: {
        type: DataTypes.STRING
    },
    customer_zip: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

Customer.hasMany(Boat, {
    foreignKey: 'customerId',
    sourceKey: 'id_customer'
});
Boat.belongsTo(Customer, {
    foreignKey: 'customerId',
    targetKey: 'id_customer'
});


Customer.hasMany(Rating, {
    foreignKey: 'customerId',
    sourceKey: 'id_customer'
});
Rating.belongsTo(Customer, {
    foreignKey: 'customerId',
    targetKey: 'id_customer'
});


Customer.hasMany(Contract, {
    foreignKey: 'customerId',
    sourceKey: 'id_customer'
});
Contract.belongsTo(Customer, {
    foreignKey: 'customerId',
    targetKey: 'id_customer'
});


Customer.belongsToMany(Service, {
    through: ServicePreferences,
    uniqueKey: 'customerId',
    foreignKey: 'customerId'
});
Service.belongsToMany(Customer, {
    through: ServicePreferences,
    uniqueKey: 'serviceId',
    foreignKey: 'serviceId'
});


// Customer.belongsToMany(ServiceProviders, {
//     through: Contract,
// });
// ServiceProviders.belongsToMany(Customer, {
//     through: Contract,
// });