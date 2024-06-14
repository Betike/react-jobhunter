import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiURL } from '../constants';

// Helper function to get initial state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    return {
        isAuthenticated: !!token,
        user: user ? JSON.parse(user) : null,
        token: token || null,
        status: 'idle',
        error: null,
    };
}

export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const response = await fetch(`${apiURL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                let errorMessage = 'Unknown error';
                if (response.status === 409) {
                    errorMessage = 'Email already registered';
                } else if (response.status === 400) {
                    errorMessage = 'All fields are required';
                } else if (response.status === 500) {
                    errorMessage = 'Internal Server Error';
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            await thunkAPI.dispatch(authenticate({
                email: userData.email,
                password: userData.password
            }));
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const authenticate = createAsyncThunk(
    'auth/authentication',
    async (credentials, thunkAPI) => {
        credentials.strategy = "local";
        try {
            const response = await fetch(`${apiURL}/authentication`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate');
            }

            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken)
            localStorage.setItem("user", JSON.stringify(data.user))
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = getInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("accessToken", state.token);
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.status = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failedRegister';
                state.error = action.payload;
            })
            .addCase(authenticate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(authenticate.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(authenticate.rejected, (state, action) => {
                state.status = 'failedLogin';
                state.error = action.payload;
            });
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
