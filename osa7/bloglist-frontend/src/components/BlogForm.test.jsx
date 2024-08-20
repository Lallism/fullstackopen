import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  const createBlog = vi.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={createBlog} />)
  })

  test('sends correct information on creating blog', async () => {
    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('Title:')
    const authorInput = screen.getByLabelText('Author:')
    const urlInput = screen.getByLabelText('Url:')
    const sendButton = screen.getByText('Create')

    await user.type(titleInput, 'testblog')
    await user.type(authorInput, 'testman')
    await user.type(urlInput, 'testurl.test')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testblog')
    expect(createBlog.mock.calls[0][0].author).toBe('testman')
    expect(createBlog.mock.calls[0][0].url).toBe('testurl.test')
  })
})
