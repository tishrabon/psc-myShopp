import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from './slice/authSlice';
import { userDataSlice } from './slice/userDataSlice';


const rootReducer = combineReducers({
  auth: authSlice.reducer,
  userData: userDataSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;