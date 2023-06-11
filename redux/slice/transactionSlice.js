import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'transaction',
  initialState: {
    transactions: [],
  },
  reducers: {
    
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions = [...state.transactions, ...action.payload];
    },
    updateTransaction: (state, action) => {
      const { index, data } = action.payload;
      state.transactions[index] = data;
    },
    removeTransaction: (state, action) => {
      const { index } = action.payload;
      state.transactions.splice(index, 1);
    },
  },
});

export default slice.reducer;