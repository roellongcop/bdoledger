import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './slice/counterSlice';
import transactionSlice from './slice/transactionSlice';
import settingSlice from './slice/settingSlice';
import logSlice from './slice/logSlice';
import userSlice from './slice/userSlice';
import { asyncFunctionMiddleware } from './middleware/asyncFunctionMiddleware';

const store = configureStore({
  reducer: {
    TRANSACTION: transactionSlice,
    COUNTER: counterSlice,
    SETTING: settingSlice,
    LOG: logSlice,
    USER: userSlice,
  },
  middleware: [
    asyncFunctionMiddleware,
  ],
});


export default store;