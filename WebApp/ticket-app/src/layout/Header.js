
import { useContext, useState } from "react"
import { Container, Form, FormControl, Nav, Navbar, Button, Image } from "react-bootstrap"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { UserContext } from "../App"


const Header = () => {
    const [kw, setKw] = useState("")
    const nav = useNavigate()
    const [user, dispatch] = useContext(UserContext)

    const search = (event) => {
        event.preventDefault()

        nav(`/?kw=${kw}`)
    }
    const logout = (evt) => {
        evt.preventDefault()
        dispatch({"type": "logout"})
    }
    let btn = <>
        <Link to="/login" className="nav-link text-info">Dang nhap</Link>
        <Link to="/register" className="nav-link text-danger">Dang ky</Link>
    </>
    // let default_avatar = ''
    if (user != null)
        btn = <>
            {user.avatar !== null && <Image src={user.avatar} width={40} height={40} style={{borderRadius: 20}}/>}
            {/* {user.avatar === null && <Image source={require('./image/default_avatar.jpeg')} width={40} height={40} style={{boderRadius: 40}}/>} */}
            <Link to="/" className="nav-link text-danger">{user.username}</Link>
            <a href="/" onClick={logout} className="nav-link text-danger">Dang xuat</a>
        </>

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>TuVuBus</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <Nav><Link to="/" className="nav-link">Trang Chu</Link></Nav>
                    <Nav><Link to="/feature" className="nav-link">Ve Chung Toi</Link></Nav>
                    <Form className="d-flex" onSubmit={search}>
                        <FormControl
                            type="search"
                            value={kw}
                            onChange={(event) => setKw(event.target.value)}
                            placeholder="Tu khoa..."
                            className="me-2"
                            aria-label="Search" />
                        <Button type="submit" variant="outline-success">Tim</Button>
                    </Form>
                        
                    </Nav>
                    <Nav>{btn}</Nav>
                    {/* <Nav>
                    <Nav.Link eventKey={2}>
                    <Link to="/login" className="nav-link text-danger">Dang nhap</Link>
                    
                    
                    </Nav.Link> */}
                    {/* </Nav> */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Header
