import {createAsyncThunk} from '@reduxjs/toolkit';
import {createAction} from '@reduxjs/toolkit';
import {data} from '../../../types/auth.type';

// Synchronous logout action
export const logout = createAction('auth/logout');

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: {data: data}, {rejectWithValue}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = {
        user: {
          name: credentials.data.name,
          password: credentials.data.password,
          role: credentials.data.role,
        },
        token: 'dummy_token',
      };
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  },
);
