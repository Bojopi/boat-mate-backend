import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Gallery } from "./Gallery.js";
import { Conversation } from "./Conversation.js";

export const Invoice = sequelize.define('invoices', {
    id_invoice: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    invoice_date: {
        type: DataTypes.DATE
    },
    invoice_state: {
        type: DataTypes.STRING
    },
    invoice_type: {
        type: DataTypes.STRING,
        defaultValue: 'Invoice'
    },
    invoice_order: {
        type: DataTypes.FLOAT,
        defaultValue: 1000
    },
    invoice_service: {
        type: DataTypes.STRING
    },
    invoice_amount: {
        type: DataTypes.FLOAT
    },
    invoice_client: {
        type: DataTypes.STRING
    },
    invoice_email: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})