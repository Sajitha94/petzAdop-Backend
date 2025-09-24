import { Router } from "express";
import {
  adop_pet_create,
  adop_pet_delete,
  adop_pet_list,
  adop_pet_update,
} from "../contoller/adopPetsController.js";
import { protect } from "../middleware/authMiddleware.js";

const adopPetsRouter = Router();
adopPetsRouter.post("/", protect, adop_pet_create); // Create pet
adopPetsRouter.put("/:id", protect, adop_pet_update); // Update pet by ID
adopPetsRouter.get("/", protect, adop_pet_list); // List all pets
adopPetsRouter.delete("/:id", protect, adop_pet_delete);
export default adopPetsRouter;
