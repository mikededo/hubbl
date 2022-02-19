import { Router } from "express";
import { FetchDashboardController } from "../controllers";
import middlewares from "../middlewares";

const DashboardRouter = Router();

/**
 * @description Loads the dashboard information for the gym for the 
 * token user.
 */
DashboardRouter.get('/:id', middlewares.auth, (req, res) => {
  FetchDashboardController.execute(req, res)
});

export default DashboardRouter;