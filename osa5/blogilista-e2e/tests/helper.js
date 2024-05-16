const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', {name: 'Login'}).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', {name: 'New blog'}).click()
  await page.getByLabel('Title:').fill(title)
  await page.getByLabel('Author:').fill(author)
  await page.getByLabel('Url:').fill(url)
  await page.getByRole('button', {name: 'Create'}).click()
}

export {loginWith, createBlog}