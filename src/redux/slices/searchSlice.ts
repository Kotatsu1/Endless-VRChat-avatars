import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SearchAvatar } from "@/types";

interface SearchState {
  avatars: SearchAvatar[];
  searchQuery: string;
  page: number;
  totalPages: number;
  scrollbarValue: number;
}

const initialState: SearchState = {
  avatars: [],
  searchQuery: '',
  page: 0,
  totalPages: 0,
  scrollbarValue: 0
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setAvatars(state, action: PayloadAction<SearchAvatar[]>) {
      state.avatars = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setScrollbarValue(state, action: PayloadAction<number>) {
      state.scrollbarValue = action.payload;
    }
  }
});

export const { reducer: searchReducer, actions: searchActions } = searchSlice;