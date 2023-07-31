import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const License = sequelize.define('licenses', {
    id_license: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    license_name: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    license_url: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
}, {
    timestamps: false
})

