import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const UserBlog = ({ blog }) => {
  return (
    <ListItem>
      <ListItemText>{blog.title}</ListItemText>
    </ListItem>
  )
}

const User = () => {
  const id = useParams().id
  const user = useSelector((state) =>
    state.users.find((user) => user.id === id)
  )

  if (!user) {
    return null
  }

  return (
    <div>
      <Typography variant="h5" component="h3">
        {user.name}
      </Typography>
      <List>
        <ListSubheader>Added blogs</ListSubheader>
        {user.blogs.map((blog) => (
          <UserBlog key={blog.id} blog={blog} />
        ))}
      </List>
    </div>
  )
}

export default User
