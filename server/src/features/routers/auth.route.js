import express from "express"
import { login, register, emailCodeVerification, adminLoginStep1, adminLoginStep2, forgotPassword, resetPassword, logout, adminRegister } from "../controllers/auth.controller.js";
import { validateRequest } from "/Users/orazu/Desktop/fullstack course/project Ecommance shop/server/src/shared/middleware/validateRequest.js"
import { registerSchema, verifySchema, loginSchema } from "../validation/auth.schemas.js"

const router = express.Router()

router.post("/register", validateRequest(registerSchema, "body"), register)
router.post("/admin/register", adminRegister)
router.post("/verify", router.post("/verify", validateRequest(verifySchema, "body"), emailCodeVerification))
router.post("/login", validateRequest(loginSchema, "body"), login)
router.post("/admin/login", adminLoginStep1)
router.post("/admin/login2", adminLoginStep2)
router.post("/forgotPassward", forgotPassword)
router.post("/resetPassward", resetPassword)
router.post("/logout", logout)

// module.exports = router;
export default router;