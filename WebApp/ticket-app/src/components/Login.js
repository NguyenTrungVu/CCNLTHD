
import React, { useState, useContext } from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { UserContext } from '../App'
import { Navigate } from 'react-router-dom'
import Api, { endpoints, authApi } from '../configs/Api'
import cookies from 'react-cookies'

const Login = () => {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [user, dispatch] = useContext(UserContext)
    const [ermg, setErmg] = useState(null)

    const login = async (evt) => {
        evt.preventDefault() 
        try {
            const res = await Api.post(endpoints['login'], {
            'username': username,
            'password': password,
            'client_id': 'ctIXmPOAprPeaJbULFaP9p6RpRMAZoN6gPBD04UT',
            'client_secret': 'xitlBzOkBTvRF6Q5BlkOvGnDzpdsQ837Wo4dIPQXbeP3fw9cwh5xP9C4s1Fvhulgh3JdcyPXhRIWWnnkR6mtDYqNis7ZghcmdG8EaK7XU722XtYby00d6T2YRZH4ncDb',
            'grant_type': 'password'
        })

        // luu trong cookies
        console.info(res.data)
        cookies.save('token', res.data.access_token)

        const user = await authApi().get(endpoints['current-user'])
        console.info(user.data)
        dispatch({
            'type': 'login',
            'payload': user.data
        })
        } catch (error) {
            console.info(error)
            setErmg('Username hoac password KHONG chinh xac!!!')
        }
        
    }

    if (user != null)
        return <Navigate to="/" />
        
    return (
        <Container>
            <h1 className="text-center text-danger">DANG NHAP</h1>
            <Form onSubmit={login}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" 
                        value={username} 
                        onChange={(evt) => setUsername(evt.target.value)}
                        placeholder="Nhap username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" 
                            value={password} 
                            onChange={(evt) => setPassword(evt.target.value)}
                            placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default Login
