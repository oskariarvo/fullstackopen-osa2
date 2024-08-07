import axios from "axios"
const baseURL = "http://localhost:3001/persons"

const getAll = () => { 
    return (
        axios
            .get(baseURL) 
            .then(response => response.data)
    )}
const create = newObject => {
    return (
        axios
            .post(baseURL, newObject)
            .then(response => response.data)
    )
}
const deleteObject = id => {
    return (
        axios
            .delete(`${baseURL}/${id}`)
            .then(response => response.data)
    )
}
const change = (id, newObject) => {
    return (
        axios
            .put(`${baseURL}/${id}`, newObject)
            .then(response => response.data)
    )
}

export default { getAll, create, deleteObject, change }