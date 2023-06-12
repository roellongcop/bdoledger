import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "log",
  initialState: {
    logs: [],
    totalLogs: 0,
    logsOffset: 0,
  },
  reducers: {
    setLogState: (state, action) => {
      const logs = action.payload;
      state.logs = logs;
      state.totalLogs = logs.length;
      state.logsOffset = logs.length;
    },
    setLogs: (state, action) => {
      state.logs = action.payload;
      state.totalLogs = action.payload.length;
      state.logsOffset = action.payload.length;
    },
    setOffset: (state, action) => {
      state.logsOffset += action.payload;
    },
    addLog: (state, action) => {
      state.logs = [...state.logs, ...action.payload];
    },
  },
});

export default slice.reducer;
