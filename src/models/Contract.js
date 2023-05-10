import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Contract = sequelize.define('contracts', {
    id_contract: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

