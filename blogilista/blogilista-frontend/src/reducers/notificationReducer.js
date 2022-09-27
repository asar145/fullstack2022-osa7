import { createSlice } from '@reduxjs/toolkit'

let timeOutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: 'initial notification',
    show: false,
    cssClass: 'error'
  },
  reducers: {
    setNotificationMessage(state, action) {
      state.message = action.payload.message
      state.cssClass = action.payload.cssClass
      state.show = true
    },
    toggleOffNotification(state) {
      state.show = false
    }
  }
})

export const setNotification = (message, cssClass, time) => {
  return (dispatch) => {
    clearTimeout(timeOutId)
    timeOutId = setTimeout(() => {
      dispatch(toggleOffNotification())
    }, time * 1000)
    dispatch(setNotificationMessage({ message, cssClass }))
  }
}

export const { setNotificationMessage, toggleOffNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
