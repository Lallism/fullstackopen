import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { useState } from 'react'
import _ from 'lodash'
import Book from './Book'

const Books = () => {
  const [allGenres, setAllGenres] = useState([])
  const client = useApolloClient()

  const books = useQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      let genres = []
      data.allBooks.forEach((book) => (genres = genres.concat(book.genres)))
      setAllGenres(_.uniq(genres))
    }
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
    }
  })

  if (books.loading) {
    return <div>loading</div>
  }

  return (
    <div>
      <h2>books</h2>

      <div>genres: </div>
      <button onClick={() => books.refetch({ genre: null })}>show all</button>
      {allGenres.map((genre) => (
        <button key={genre} onClick={() => books.refetch({ genre })}>
          {genre}
        </button>
      ))}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((book) => (
            <Book key={book.title} book={book} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
