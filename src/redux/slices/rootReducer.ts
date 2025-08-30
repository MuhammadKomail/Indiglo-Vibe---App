import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import translationReducer from './translationSlice/translationSlice';
import authReducer from './authSlice/authSlice';
import chatReducer from './chatSlice/chatSlice';
import {reduxStorage} from '../../services/storage';
import notificationReducer from './notificationSlice/notificationSlice';
import callReducer from './callSlice/callSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage: reduxStorage,
  whitelist: ['user', 'token'], // only persist these fields
};

const rootReducer = combineReducers({
  translationState: translationReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  chat: chatReducer,
  notification: notificationReducer,
  call: callReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
