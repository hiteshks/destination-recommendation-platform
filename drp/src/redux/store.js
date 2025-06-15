import { configureStore } from "@reduxjs/toolkit";
import homePageReducer from "../slices/homePageSlice";
import userDataReducer from "../slices/userDataSlice";

export const store = configureStore({
  reducer: {
    homePage: homePageReducer,
    userData: userDataReducer,
  },
});
