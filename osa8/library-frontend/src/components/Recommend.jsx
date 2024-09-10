import { useQuery } from '@apollo/client'
import Book from './Book'
import { ALL_BOOKS, USER } from '../queries'

const Booklist = (genre) => {
  const books = useQuery(ALL_BOOKS, { variables: genre })

  if (books.loading) {
    return <div>loading</div>
  }

  return (
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
  )
}

const Recommend = () => {
  const user = useQuery(USER)

  if (user.loading) {
    return <div>loading</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <b>{user.data.me.favoriteGenre}</b>
      <Booklist genre={user.data.me.favoriteGenre} />
    </div>
  )
}

export default Recommend
