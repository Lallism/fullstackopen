import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'
import { useState } from 'react'

const Authors = ({ token }) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const authors = useQuery(ALL_AUTHORS, {
    onCompleted: (data) => setName(data.allAuthors[0].name)
  })

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (authors.loading) {
    return <div>loading</div>
  }

  const submit = (event) => {
    event.preventDefault()

    updateAuthor({
      variables: {
        name,
        born: Number(year)
      }
    })

    setYear('')
  }

  const editAuthor = () => {
    return (
      <>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            <label htmlFor="name">name</label>
            <select
              id="name"
              value={name}
              onChange={({ target }) => {
                setName(target.value)
              }}
            >
              {authors.data.allAuthors.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">year</label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={({ target }) => {
                setYear(target.value)
              }}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </>
    )
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && editAuthor()}
    </div>
  )
}

export default Authors
