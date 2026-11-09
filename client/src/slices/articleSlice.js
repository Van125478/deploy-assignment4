import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const errorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/articles");
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot load articles"));
    }
  }
);

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/articles", payload);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot add article"));
    }
  }
);

export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/articles/${id}`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot update article"));
    }
  }
);

export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/articles/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(errorMessage(error, "Cannot delete article"));
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearArticleError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? { ...item, ...action.payload } : item
        );
        state.error = null;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearArticleError } = articleSlice.actions;
export default articleSlice.reducer;
