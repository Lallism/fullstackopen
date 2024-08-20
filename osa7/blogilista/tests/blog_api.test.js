const { test, after, before, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

let authorization

before(async () => {
  console.log('logging in')
  const user = {
    username: "root",
    password: "sekret"
  }

  const response = await api
    .post('/api/login')
    .send(user)

  authorization = 'Bearer ' + response.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('right number of blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: authorization })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs use id for identification', async () => {
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: authorization })
  
  response.body.forEach(blog => {
    assert.strictEqual('id' in blog, true)
  })
})

describe('adding blogs', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: "asd",
      author: "man",
      url: "someurl.idk",
      likes: 5
    }
    
    await api
      .post('/api/blogs')
      .set({ Authorization: authorization })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api
      .get('/api/blogs')
      .set({ Authorization: authorization })
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })
  
  test('sets likes to 0 if no value is given', async () => {
    const newBlog = {
      title: "asd",
      author: "man",
      url: "someurl.idk"
    }
    
    const sentBlog = await api
      .post('/api/blogs')
      .set({ Authorization: authorization })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(sentBlog.body.likes, 0)
  })
  
  test('fails with status 400 if no title is given', async () => {
    const newBlog = {
      author: "man",
      url: "someurl.idk",
      likes: 5
    }
    
    await api
      .post('/api/blogs')
      .set({ Authorization: authorization })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: authorization })

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  
  test('fails with status 400 if no url is given', async () => {
    const newBlog = {
      title: "asd",
      author: "man",
      likes: 5
    }
    
    await api
      .post('/api/blogs')
      .set({ Authorization: authorization })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: authorization })

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('fails with status 401 if there is no token', async () => {
    const newBlog = {
      title: "asd",
      author: "man",
      url: "someurl.idk",
      likes: 5
    }
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: authorization })

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

test('blogs can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ Authorization: authorization })
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  
  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

test('blogs can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  
  const updatedBlog = {
    title: "asd",
    author: "man",
    url: "someurl.idk",
    likes: 15
  }
  
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .set({ Authorization: authorization })
    .send(updatedBlog)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})