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
const removeUndefinedObject = (object) => {
    Object.keys(object).forEach((key) => {
        if (object[key] === undefined || object[key] === null) {
            delete object[key];
        }
    });
    return object;
};
const updateNestedObjectParser = (obj) => {
    console.log("obj", obj);
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray()) {
            const res = updateNestedObjectParser(obj[key]);
            Object.keys(res).forEach((index) => {
                final[`${key}.${index}`] = res[index];
            });
        } else {
            final[key] = obj[key];
        }
    });
    console.log("final", final);

    return final;
};
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
};
