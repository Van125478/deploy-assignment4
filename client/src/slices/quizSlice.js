import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/quizzes");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cannot load quizzes");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    activeQuizId: null,
    currentIndex: 0,
    selectedOption: null,
    score: 0,
    finished: false,
    status: "idle",
    error: null,
  },
  reducers: {
    startQuiz(state, action) {
      state.activeQuizId = action.payload;
      state.currentIndex = 0;
      state.selectedOption = null;
      state.score = 0;
      state.finished = false;
      state.error = null;
    },
    selectOption(state, action) {
      state.selectedOption = action.payload;
    },
    submitAnswer(state) {
      const quiz = state.quizzes.find((item) => item._id === state.activeQuizId);
      const question = quiz?.questions?.[state.currentIndex];

      if (!question || state.selectedOption === null) {
        state.error = "Please select an answer";
        return;
      }

      if (state.selectedOption === question.correctAnswerIndex) {
        state.score += 1;
      }

      state.error = null;
      state.selectedOption = null;

      if (state.currentIndex + 1 >= quiz.questions.length) {
        state.finished = true;
      } else {
        state.currentIndex += 1;
      }
    },
    restartQuiz(state) {
      state.currentIndex = 0;
      state.selectedOption = null;
      state.score = 0;
      state.finished = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { startQuiz, selectOption, submitAnswer, restartQuiz } = quizSlice.actions;
export default quizSlice.reducer;
