import axios from 'axios'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const resource = (baseUrl) => {
  const getAll = async () => {
    const response = await axios.get(baseUrl, {
      headers: { Authorization: token }
    })
    return response.data
  }

  const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject, {
      headers: { Authorization: token }
    })
    return response.data
  }

  const update = async (id, newObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, newObject, {
      headers: { Authorization: token }
    })
    return response.data
  }

  const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, {
      headers: { Authorization: token }
    })
    return response.data
  }

  return { getAll, create, update, remove }
}

export default { setToken, resource }
