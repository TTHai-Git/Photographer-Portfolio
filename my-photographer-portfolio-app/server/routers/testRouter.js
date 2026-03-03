import { Router } from "express";
import {
  AddFieldsToAsset,
  renameFields,
  renameMyCollection,
} from "../controllers/test.js";
const testRouters = new Router();
testRouters.get("/change-collection-name", renameMyCollection);
testRouters.get("/change-fields-name", renameFields);
testRouters.get("/add-fields-to-asset", AddFieldsToAsset);

export default testRouters;
