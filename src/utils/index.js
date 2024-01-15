"use strict";
const _ = require("lodash");
const getInfoData = ({ fill = [], object = {} }) => {
    return _.pick(object, fill);
};
module.exports = {
    getInfoData,
};
