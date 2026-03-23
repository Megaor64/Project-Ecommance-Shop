import express from "express"
import { deleteUser, getMyOrders, getUserById, getUsers, updateUser } from "../controllers/users.controller.js"
import { authMiddleware } from "../../shared/middleware/authMiddleware.js"
import { checkPermissions } from "../../shared/middleware/checkPermissions.js"
import { validateRequest } from "../../shared/middleware/validateRequest.js"
import { getUserByIdParamsSchema, updateUserBodySchema } from "../validation/user.schemas.js"

const router = express.Router()

router.get("/", authMiddleware, getUsers)
router.get("/:id", authMiddleware, getMyOrders)
router.get("/:id", validateRequest(getUserByIdParamsSchema, "params"), authMiddleware, getUserById)
router.patch("/:id", validateRequest(getUserByIdParamsSchema, "params"), validateRequest(updateUserBodySchema, "body"), authMiddleware, checkPermissions, updateUser)
router.delete("/:id", validateRequest(getUserByIdParamsSchema, "params"), authMiddleware, checkPermissions, deleteUser)

export default router
