import { useState } from 'react'

const BlogOpen = ({
  blog,
  user,
  handleLike,
  handleDelete,
  handleAddComment
}) => {
  const [comment, setComment] = useState('')

  const handleComment = () => {
    handleAddComment(blog, comment)
    setComment('')
  }

  if (!blog) {
    return null
  }
  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <br />
      <a href={`${blog.url}`}>{blog.url}</a>
      <p>
        {blog.likes.toString()} likes{' '}
        <button onClick={() => handleLike(blog)}> like </button>
      </p>
      <p>added by {user.name}</p>
      {user.username === blog.user.username ? (
        <button onClick={() => handleDelete(blog)}>delete</button>
      ) : (
        <></>
      )}
      <br />
      <h2>comments</h2>
      <input
        id="comment"
        type="text"
        value={comment}
        name="Comment"
        onChange={({ target }) => setComment(target.value)}
      />
      <button onClick={() => handleComment()}> add comment </button>
      <ul>
        {blog.comments.map((comment) => {
          return <li key={comment.id}>{comment.content}</li>
        })}
      </ul>
    </div>
  )
}

export default BlogOpen
