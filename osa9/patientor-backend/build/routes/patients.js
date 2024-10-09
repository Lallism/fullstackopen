"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
const newPatientParser = (req, _res, next) => {
    try {
        utils_1.newPatientSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
const errorMiddleware = (error, _req, res, next) => {
    if (error instanceof zod_1.default.ZodError) {
        res.status(400).send(error.issues);
    }
    else {
        next(error);
    }
};
router.get('/', (_req, res) => {
    res.send(patientService_1.default.getPatients());
});
router.post('/', newPatientParser, (req, res) => {
    const addedPatient = patientService_1.default.addPatient(req.body);
    res.send(addedPatient);
});
router.use(errorMiddleware);
exports.default = router;
