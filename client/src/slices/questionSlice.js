import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const errorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/questions");
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot load questions"));
    }
  }
);

export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/questions", payload);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot add question"));
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/updateQuestion",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/questions/${id}`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot update question"));
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot delete question"));
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearQuestionError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? { ...item, ...action.payload } : item
        );
        state.error = null;
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearQuestionError } = questionSlice.actions;
export default questionSlice.reducer;
