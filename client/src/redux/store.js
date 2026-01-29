import { configureStore } from '@reduxjs/toolkit'
import {AuthSlice} from './slice/auth.slice'

export const store = configureStore({
    reducer: {
        [AuthSlice.name]:AuthSlice.reducer
    }
})