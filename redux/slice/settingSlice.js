import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'setting',
  initialState: {
    apiUrl: '',
    accessToken: ''
  },
  reducers: {
    setSettingState: (state, action) => {
      const { apiUrl, accessToken } = action.payload;
      state.accessToken = accessToken;
      state.apiUrl = apiUrl;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  }
})

export default slice.reducer;