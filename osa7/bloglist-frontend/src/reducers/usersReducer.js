import { createSlice } from '@reduxjs/toolkit'
import resourceService from '../services/resource'
import { logout } from './userReducer'

const userService = resourceService.resource('/api/users')

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll()
      dispatch(setUsers(users))
    } catch (error) {
      dispatch(logout())
    }
  }
}

export default usersSlice.reducer
