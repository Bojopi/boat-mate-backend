import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Boat } from './Boat.js'

export const Customer = sequelize.define('customers', {
    id_customer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.BLOB,
    },
    position: {
        type: DataTypes.STRING
    },
    service: {
        type: DataTypes.STRING,
    },
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
