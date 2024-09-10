import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book ${addedBook.title} was added`)
    }
  })

  return (
    <div>
      <div>
        <Link to="/">
          <button>authors</button>
        </Link>
        <Link to="/books">
          <button>books</button>
        </Link>
        {token ? (
          <>
            <Link to="/add">
              <button>add book</button>
            </Link>
            <Link to="/recommend">
              <button>recommend</button>
            </Link>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <Link to="/login">
            <button>login</button>
          </Link>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Authors token={token} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/recommend" element={<Recommend />} />
      </Routes>
    </div>
  )
}

export default App
