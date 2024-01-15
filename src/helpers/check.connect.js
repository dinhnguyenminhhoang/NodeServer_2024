"use strict";

const mongoose = require("mongoose");
const os = require("os");
const _SERCONDS = 5000;
//count connect
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log("number connections", numConnections);
};
// check over load
const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numberCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // ex maximun of connection based on  number  ojs cores
        const maxConnections = numberCores * 5;
        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        if (numConnections > maxConnections) {
            console.log("connection over load");
        }
    }, _SERCONDS);
};
module.exports = { countConnect, checkOverLoad };
