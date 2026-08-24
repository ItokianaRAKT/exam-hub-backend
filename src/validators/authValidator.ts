import { requireFields } from "../middlewares/validationMiddleware";

export const validateLogin = requireFields("email", "password");
