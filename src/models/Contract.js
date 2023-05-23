import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Contract = sequelize.define('contracts', {
    id_contract: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contract_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    contract_state: {
        type: DataTypes.STRING,
    },
    contract_description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.FLOAT,
    }
}, {
    timestamps: false
})

