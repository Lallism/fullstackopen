import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  if (!visible) {
    return (
      <div>
        <Button variant="contained" onClick={toggleVisibility} sx={{ m: 1 }}>
          {buttonLabel}
        </Button>
      </div>
    )
  }

  return (
    <div>
      {children}
      <Button variant="outlined" onClick={toggleVisibility} sx={{ m: 1 }}>
        Cancel
      </Button>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
