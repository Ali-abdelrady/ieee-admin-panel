import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { authApi } from "../Api/login";
import authSlice from "./features/AuthSlice";
import dialogSlice from "@/services/store/features/dialogSlice";

const persistConfig = {
  key: "root",
  storage,
};

const RootReducer = combineReducers({
  counter: counterSlice,
  auth: authSlice,
  dialog: dialogSlice,
  [authApi.reducerPath]: authApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, RootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
