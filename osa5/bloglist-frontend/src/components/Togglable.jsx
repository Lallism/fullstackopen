import {useState, useImperativeHandle, forwardRef} from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({buttonLabel, children}, ref) => {
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
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
    )
  }

  return (
    <div>
      {children}
      <button onClick={toggleVisibility}>Cancel</button>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable