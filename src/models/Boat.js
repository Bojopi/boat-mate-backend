import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Customer } from "./Customer.js";

export const Boat = sequelize.define('boats', {
    id_boat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
    },
    model: {
        type: DataTypes.STRING
    },
    brand: {
        type: DataTypes.STRING,
    },
    brand_motor: {
        type: DataTypes.STRING,
    },
    model_motor: {
        type: DataTypes.STRING,
    },
    year: {
        type: DataTypes.INTEGER
    },
    length: {
        type: DataTypes.STRING(10),
    },
    boat_position: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false
});

