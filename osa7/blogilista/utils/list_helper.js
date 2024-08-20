const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let result = blogs.reduce((likes, blog) => {
    return likes + blog.likes
  }, 0)

  return result
}

const favoriteBlog = (blogs) => {
  let result = blogs.reduce((currentMostLiked, blog) => {
    return blog.likes > currentMostLiked.likes ? blog : currentMostLiked
  })

  return { title: result.title, author: result.author, likes: result.likes }
}

const mostBlogs = (blogs) => {
  let grouped = _.groupBy(blogs, 'author')

  let result = _.reduce(grouped, (currentMostBlogs, author) => {
    return author.length > currentMostBlogs.length ? author : currentMostBlogs
  })

  return { author: result[0].author, blogs: result.length}
}

const mostLikes = (blogs) => {
  let grouped = _.groupBy(blogs, 'author')

  let likes = _.reduce(grouped, () => {
    
  })

  let result = _.reduce(likes, (currentMostLiked, author) => {

  })
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }