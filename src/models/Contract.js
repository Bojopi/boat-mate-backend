import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Gallery } from "./Gallery.js";
import { Conversation } from "./Conversation.js";

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
    contract_price: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    contract_date_finished: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    timestamps: false
})

Contract.hasMany(Gallery, {
    foreignKey: 'contractId',
    sourceKey: 'id_contract'
});
Gallery.belongsTo(Contract, {
    foreignKey: 'contractId',
    targetKey: 'id_contract'
});


Contract.hasOne(Conversation, {
    foreignKey: 'contractId',
    sourceKey: 'id_contract'
});
Conversation.belongsTo(Contract, {
    foreignKey: 'contractId',
    targetKey: 'id_contract'
});