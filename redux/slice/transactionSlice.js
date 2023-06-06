import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'transaction',
  initialState: {
    total: 0,
    totalAnnabelle: 0,
    totalRoel: 0,
    transactions: [],
    totalTransactions: 0,
    transactionsOffset: 0
  },
  reducers: {
    setTransactionState: (state, action) => {
      const { transactions, total, totalAnnabelle, totalRoel, totalTransactions } = action.payload;
      state.transactions = transactions;
      state.total = total;
      state.totalAnnabelle = totalAnnabelle;
      state.totalRoel = totalRoel;
      state.totalTransactions = totalTransactions;
      state.transactionsOffset = transactions.length;
    },
    setOffset: (state, action) => {
      state.transactionsOffset += action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.totalTransactions = action.payload?.length;
      state.transactionsOffset = action.payload?.length;
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