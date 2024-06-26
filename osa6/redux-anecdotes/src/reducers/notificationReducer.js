import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    }
  }
})

export const {changeNotification} = notificationSlice.actions

export const setNotification = (message, duration) => {
  return dispatch => {
    dispatch(changeNotification(message))
    setTimeout(() => dispatch(changeNotification(null)), duration * 1000)
  }
}

export default notificationSlice.reducer