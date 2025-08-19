import { schoolSchema } from "./validation/schoolSchema.js";

export function validateSchool(req, res, next) {
    const { error } = schoolSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}