import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      const newState = state.map((blog) => {
        if (blog.id === action.payload.id) {
          return action.payload
        }
        return blog
      })
      return newState.sort((a, b) => b.likes - a.likes)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      state.splice(
        state.findIndex((a) => a.id === action.payload),
        1
      )
    },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    }
  }
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogsService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = (content) => {
  return async (dispatch) => {
    await blogsService.deleteBlog(content.id)
    dispatch(removeBlog(content.id))
  }
}

export const addLike = (content) => {
  return async (dispatch) => {
    const newBlog = {
      ...content,
      user: content.user.id,
      comments: content.comments.map((a) => {
        return a.id
      }),
      likes: content.likes + 1
    }
    const updatedBlog = await blogsService.update(newBlog.id, newBlog)
    dispatch(updateBlog(updatedBlog))
  }
}

export const addComment = (blog, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogsService.postComment(blog.id, {
      blog: {
        ...blog,
        user: blog.user.id,
        comments: blog.comments.map((a) => {
          return a.id
        })
      },
      comment: {
        content: comment
      }
    })
    dispatch(updateBlog(updatedBlog))
  }
}

export const { updateBlog, appendBlog, removeBlog, setBlogs } =
  blogsSlice.actions
export default blogsSlice.reducer
