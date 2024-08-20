import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    title: 'testblog',
    author: 'testman',
    url: 'testurl.test',
    likes: 5,
    user: {
      name: 'name',
    },
  }

  const blogUser = {
    username: 'user',
    name: 'name',
  }

  const likeBlog = vi.fn()

  let container

  beforeEach(() => {
    container = render(
      <Blog blog={blog} likeBlog={likeBlog} user={blogUser} />,
    ).container
  })

  test('shows title and author', () => {
    const element = screen.getByText('testblog testman')
    expect(element).toBeDefined()
  })

  test('extra information hidden by default', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('view button shows extra information', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking like twice works', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})
