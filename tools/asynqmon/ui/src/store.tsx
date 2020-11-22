import { combineReducers, configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./reducers/settingsReducer";
import queuesReducer from "./reducers/queuesReducer";

const rootReducer = combineReducers({
  settings: settingsReducer,
  queues: queuesReducer,
});

// AppState is the top-level application state maintained by redux store.
export type AppState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: rootReducer,
});
