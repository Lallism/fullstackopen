const {test, expect, beforeEach, describe} = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Bloglist', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'Login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({page}) => {
      loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('logged in as Matti Luukkainen')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      loginWith(page, 'mluukkai', 'salasana')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(({page}) => {
      loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({page}) => {
      await createBlog(page, 'Hello world', 'Mr man', 'testurl.test')

      await expect(page.getByText('Hello world Mr man')).toBeVisible()
    })

    test('blogs can be liked', async ({page}) => {
      await createBlog(page, 'Hello world', 'Mr man', 'testurl.test')
      
      const blog = page.getByText('Hello world Mr man')
      await blog.getByRole('button', {name: 'view'}).click()
      await blog.getByRole('button', {name: 'Like'}).click()
      await expect(blog.getByText('1')).toBeVisible()
    })

    test('blogs can be deleted', async ({page}) => {
      await createBlog(page, 'Hello world', 'Mr man', 'testurl.test')
      page.on('dialog', dialog => dialog.accept())

      const blog = page.getByText('Hello world Mr man')
      await blog.getByRole('button', {name: 'view'}).click()
      await blog.getByRole('button', {name: 'delete'}).click()
      await expect(page.getByText('Hello world Mr man')).not.toBeVisible()
    })

    test('delete only shows for the creator of a blog', async ({page, request}) => {
      await createBlog(page, 'Hello world', 'Mr man', 'testurl.test')

      const blog = page.getByText('Hello world Mr man')
      await blog.getByRole('button', {name: 'view'}).click()
      await expect(blog.getByRole('button', {name: 'delete'})).toBeVisible()
      await page.getByRole('button', {name: 'logout'}).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Esim Erkki',
          username: 'eerkki',
          password: 'salasana'
        }
      })
      await loginWith(page, 'eerkki', 'salasana')
      await blog.getByRole('button', {name: 'view'}).click()
      await expect(blog.getByRole('button', {name: 'delete'})).not.toBeVisible()
    })

    test('blogs are sorted based on likes, with most likes first', async ({page}) => {
      await createBlog(page, 'First blog', 'Mr man', 'testurl.test')
      await page.getByText('First blog Mr man').waitFor()
      await createBlog(page, 'Second blog', 'Mr man', 'testurl.test')
      await page.getByText('Second blog Mr man').waitFor()
      await createBlog(page, 'Third blog', 'Mr man', 'testurl.test')
      await page.getByText('Third blog Mr man').waitFor()

      const secondBlog = page.getByText('Second blog')
      const thirdBlog = page.getByText('Third blog')

      await secondBlog.getByRole('button', {name: 'view'}).click()
      await secondBlog.getByRole('button', {name: 'like'}).click()
      await expect(secondBlog.getByText('1')).toBeVisible()
      await thirdBlog.getByRole('button', {name: 'view'}).click()
      await thirdBlog.getByRole('button', {name: 'like'}).click()
      await expect(thirdBlog.getByText('1')).toBeVisible()
      await thirdBlog.getByRole('button', {name: 'like'}).click()
      await expect(thirdBlog.getByText('2')).toBeVisible()

      const blogs = page.locator('.blog')
      await expect(blogs.first()).toContainText('Third blog Mr man')
      await expect(blogs.nth(1)).toContainText('Second blog Mr man')
      await expect(blogs.last()).toContainText('First blog Mr man')
    })
  })
})