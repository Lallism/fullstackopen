import { createSlice } from '@reduxjs/toolkit'

let timeoutID = undefined

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    }
  }
})

export const { changeNotification } = notificationSlice.actions

export const setNotification = (message, duration) => {
  return (dispatch) => {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    dispatch(changeNotification({ message, type: 'notification' }))
    timeoutID = setTimeout(
      () => dispatch(changeNotification(null)),
      duration * 1000
    )
  }
}

export const setNotificationError = (message, duration) => {
  return (dispatch) => {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    dispatch(changeNotification({ message, type: 'error' }))
    timeoutID = setTimeout(
      () => dispatch(changeNotification(null)),
      duration * 1000
    )
  }
}

export default notificationSlice.reducer
