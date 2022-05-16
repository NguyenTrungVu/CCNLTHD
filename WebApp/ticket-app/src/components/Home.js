import { useEffect, useState } from "react"
import { Card, Container, Row, Spinner, Col } from "react-bootstrap"
import { Link, useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router"
import Api, { endpoints } from "../configs/Api"
import Item from "../layout/Item"

const Home = () => {

    const [routes, setRoutes] = useState([])
    const [q] = useSearchParams()
    const nav = useNavigate()
    
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
        }
        loadRoutes()
    }, [q])
  

    return(     
        <Container>
            <h1 className="text-center text-danger">CÁC TUYẾN ĐI PHỔ BIẾN</h1>
            
            {routes.length === 0 && <Spinner animation="grow" />}
            
            <Row>
                {routes.map(c => {
                  

                    return ( 
                        <Col md={6} xs={12}>
                            <Card >
                                <Item id={c.id} subject={c.subject} />
                                <Card.Body>
                                    <Card.Title>Đi từ {c.departed_place} đến {c.arrived_place}</Card.Title>
                                    <Card.Text>
                                    Thời gian di chuyển: {c.time_duration}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Container>   
        
    )
}
export default Home 
// <Col md={6} xs={12} >
                            
                        //     <Card border="primary" onClick={goToTour}>
                        //         <Card.Header>{c.subject}</Card.Header>
                        //         <Card.Body>
                        //         <Card.Title>Đi từ {c.departed_place} đến {c.arrived_place}</Card.Title>
                        //         <Card.Text>
                        //             Thời gian di chuyển: {c.time_duration}
                        //         </Card.Text>
                        //         </Card.Body>
                        //     </Card>
                        // </Col>