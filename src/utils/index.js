"use strict";
const _ = require("lodash");
const getInfoData = ({ fill = [], object = {} }) => {
    return _.pick(object, fill);
};
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
};
