import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Service = sequelize.define('services', {
    id_service: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    detail: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING
    },
    cost: {
        type: DataTypes.FLOAT
    },
}, {
    timestamps: false
});

