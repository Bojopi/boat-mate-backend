import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Rating = sequelize.define('ratings', {
    id_rating: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: DataTypes.INTEGER,
    },
    review: {
        type: DataTypes.STRING
    },
    provider_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
})

