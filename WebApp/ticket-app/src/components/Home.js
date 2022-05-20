import { useEffect, useState } from "react"
import { Card, Container, Row, Spinner, Col, Image, Carousel, Form, Button } from "react-bootstrap"
import { Link, useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router"
import Api, { endpoints } from "../configs/Api"
import Item from "../layout/Item"
import sg from "../image/sg.jpeg"
import dn from "../image/dn.jpeg"
import dl from "../image/dl.jpeg"
import Calendar from 'react-calendar';


const Home = () => {
    const [routes, setRoutes] = useState([])
    const [q] = useSearchParams()
    const nav = useNavigate()
    const [date, setDate] = useState(new Date());
    const [kw, setKw] = useState("")
    const [kw1, setKw1] = useState("")
    const [places, setPlaces] = useState([])

    useEffect (() => {
        const loadRoutes = async () => {
            let query = ""
            let routeId = q.get('route_id')
            if (routeId !== null) {
                query += `route_id=${routeId}`
            }
            let kw = q.get('kw')
            if (kw !== null) {
                if (query === "")
                    query += `kw=${kw}`
                else
                    query += `&kw=${kw}`
               
            }
            const res = await Api.get(`${endpoints['routes']}?${query}`)
            setRoutes(res.data)
            console.info(res.data)
        }
        loadRoutes()
    }, [q])
    const myStyle = {
        width: '100%',
        height: '100%',
        }
    function unique(arr) {
        var newArr = []
        newArr = arr.filter(function (item) {
            return newArr.includes(item) ? '' : newArr.push(item)
        })
        return newArr
    }
    const changeDate = date => {
        setDate(date)
    }
    const search = (event) => {
        event.preventDefault()
        let rid = ""
        routes.map(r =>{
            if(r.departed_place===kw && r.arrived_place===kw1)
                rid = r.id
            
        })
        nav(`/routes/${rid}/tours`)
    }
    useEffect(() => {
        const loadPlace = async () => {
            const res = await Api.get(endpoints['places'])
            setPlaces(res.data)
        }
        loadPlace()
    }, [])
    
    return(     
        <> 
        <Carousel fade>
            <Carousel.Item>
                <img style={{height: 700}}
                className="d-block w-100"
                src={sg}
                alt="First slide"
                />
                <Carousel.Caption>
                <h3>Thành Phố Hồ Chí Minh</h3>
                <p>Địa điểm du lịch, kinh tế bật nhất Việt Nam</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img style={{height: 700}}
                className="d-block w-100"
                src={dl}
                alt="Second slide"
                />

                <Carousel.Caption>
                <h3>Đà Lạt</h3>
                <p>Ẩn mình trong làn sương, thả hồn theo khí trời!!</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img style={{height: 700}}
                className="d-block w-100"
                src={dn}
                alt="Third slide"
                />

                <Carousel.Caption>
                <h3>Đà Nẵng</h3>
                <p>Hội An phố cổ!!</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
        <Container>
            <Form style={{backgroundColor:"#FF8D29", margin:20, padding: 20}}  onSubmit={search}>
                 <Row>
                    <Col md={4} xs={12}>
                        <h5>Điểm đi</h5>
                        <Form.Select aria-label="Default select example" onChange={(event) => setKw(event.target.value)}>
                            <option>Chọn nơi xuất phát</option>
                            {places.map(p =>{
                                
                                return(
                                    <option value={p.name} >{p.name}</option>
                                )     
                                        
                            })}
                        </Form.Select>
                        
                        
                        
                    </Col>
                    <Col md={4} xs={12}>
                        <h5>Điểm đến</h5>
                        <Form.Select aria-label="Default select example" onChange={(event) => setKw1(event.target.value)}>
                            <option>Chọn nơi đến</option>
                            {places.map(p =>{
                                        return(
                                        
                                    <option value={p.name} >{p.name}</option>
                                )     
                                
                            })}
                        </Form.Select>
                    </Col>
                    <Col md={4} xs={12}>
                        <Button type="submit" style={{backgroundColor:"#F9B208", color:"black", marginTop:50}}><b>Tìm Chuyến đi</b></Button>
                    </Col>
                </Row>
            </Form>
           
            <h1 className="text-center text-danger" style ={{margin:20}}>CÁC TUYẾN ĐI PHỔ BIẾN</h1>
            
            {routes.length === 0 && <Spinner animation="grow" />}
            
            <Row >
                {routes.map(c => {
                  

                    return ( 
                        <Col md={6} xs={12} style ={{marginBottom:20}}>
                            <Card >
                                <Row>
                                    <Col md={5} xs={12}>
                                        <Image src={c.image} fluid style={myStyle}/>
                                    </Col>
                                    <Col md={7} xs={12}>
                                    <Item id={c.id} subject={c.subject} />
                                    <Card.Body>
                                        <Card.Title>Đi từ {c.departed_place} đến {c.arrived_place}</Card.Title>
                                        <Card.Text>
                                        Thời gian di chuyển: {c.time_duration}
                                        </Card.Text>
                                    </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                            
                        </Col>
                    )
                })}
            </Row>
        </Container>  
        </>
        
        
    )
}
export default Home 
