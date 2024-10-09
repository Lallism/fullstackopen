"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const patients_1 = __importDefault(require("../data/patients"));
const utils_1 = require("../utils");
const patients = patients_1.default.map((patient) => {
    const newPatient = (0, utils_1.toNewPatient)(patient);
    newPatient.id = patient.id;
    return newPatient;
});
const getPatients = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};
const addPatient = (patient) => {
    const newPatient = Object.assign({ id: (0, uuid_1.v1)() }, patient);
    patients.push(newPatient);
    return newPatient;
};
exports.default = { getPatients, addPatient };
