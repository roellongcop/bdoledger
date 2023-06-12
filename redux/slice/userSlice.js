import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  }
})

export default slice.reducer;