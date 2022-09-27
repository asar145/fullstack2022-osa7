import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

let initialState = null
const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
if (loggedUserJSON) {
  initialState = JSON.parse(loggedUserJSON)
  blogService.setToken(initialState.token)
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    }
  }
})

export const loginUser = (user) => {
  return (dispatch) => {
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setUser(null))
  }
}

export const { setUser } = userSlice.actions
export default userSlice.reducer
