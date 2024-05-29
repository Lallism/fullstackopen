import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnedoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => 
    state.anecdotes
      .filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  )
  
  const vote = (id) => {
    const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`voted ${anecdote.content}`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnedoteList