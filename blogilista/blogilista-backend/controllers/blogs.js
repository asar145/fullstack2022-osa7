const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const { findById } = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(blogs)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = new Comment({
    content: request.body.comment.content
  })
  const savedComment = await comment.save()
  const updatedBlog = {
    title: request.body.blog.title,
    author: request.body.blog.author,
    url: request.body.blog.url,
    likes: request.body.blog.likes,
    user: request.body.blog.user,
    comments: request.body.blog.comments.concat(savedComment.id)
  }
  await Blog.findByIdAndUpdate(request.params.id, updatedBlog)
  const populatedBlog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(populatedBlog)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }
  if (!request.token || !request.user) {
    return response.status(401).json({
      error: 'Not logged in'
    })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: request.user.id
  })

  const savedBlog = await blog.save()

  await User.findByIdAndUpdate(request.user.id, {
    username: request.user.username,
    name: request.user.name,
    passwordHash: request.user.passwordHash,
    blogs: request.user.blogs.concat(savedBlog.id)
  })

  const populatedBlog = await Blog.findById(savedBlog.id).populate('user', {
    username: 1,
    name: 1
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token || !request.user) {
    return response.status(401).json({
      error: 'Not logged in'
    })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }
  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)

    await User.findByIdAndUpdate(request.user.id, {
      username: request.user.username,
      name: request.user.name,
      passwordHash: request.user.passwordHash,
      blogs: request.user.blogs.filter((a) => {
        if (a !== request.params.id) {
          return a
        }
      })
    })

    response.status(204).end()
  } else {
    response.status(401).json({ error: 'Unauthorized delete request' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: request.body.user,
    comments: request.body.comments
  })
  const updatedBlog = await Blog.findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter
