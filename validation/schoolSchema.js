import Joi from "joi";

export const schoolSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    address: Joi.string().trim().min(5).max(255).required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
});