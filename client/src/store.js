import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quizReducer from "./slices/quizSlice";
import questionReducer from "./slices/questionSlice";
import articleReducer from "./slices/articleSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    questions: questionReducer,
    articles: articleReducer,
  },
});

export default store;
