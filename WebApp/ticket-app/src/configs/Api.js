import axios from 'axios'
import cookies from 'react-cookies'

export const endpoints = {
    "routes": "/routes/",
    "places": "/places/",
    "tour-time": "/tours/",
    "routes-id": (routeId) => `/routes/${routeId}/`, 
    "tours": (routeId) => `/routes/${routeId}/tours/`,
    "tour": (tourId) => `/tours/${tourId}/`,
    "tour-detail": (tourId) => `/tours/${tourId}/tour-detail/`,
    'tour-comments': (tourId) => `/tours/${tourId}/comments/`,
    'comments': (tourId) => `/tours/${tourId}/add-comments/`,
    'users': '/users/',
    'login': '/o/token/',
    'current_user': '/users/current-user/',
}

export const authApi = () => {
    return axios.create({
        baseURL: "http://127.0.0.1:8000/",
        headers: {
            'Authorization': `Bearer ${cookies.load('token')}`
        }
    })
}
export default axios.create({
    baseURL: "http://127.0.0.1:8000/"
})