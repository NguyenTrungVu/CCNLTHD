import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Container, Spinner, Row, Card, Button, Form, Col, ListGroup, useAccordionButton, Accordion, Image } from 'react-bootstrap';
import Api, { endpoints } from '../configs/Api';
import Item from '../layout/Item';
import { useNavigate } from "react-router"

const Tour  = () => {
    const[tours, setTours] = useState([])
    const [routes, setRoutes] = useState([])
    const{routeId} = useParams()
    const nav = useNavigate()
    useEffect(() => {
        const loadTours = async () => {
            const res = await Api.get(endpoints['tours'](routeId))
            setTours(res.data)
            console.info(res.data)
        }
        loadTours()
    }, [])
    useEffect (() => {
        const loadRoutes = async () => {
            const res = await Api.get(endpoints['routes-id'](routeId))
            setRoutes(res.data)
            console.info(res.data)
        }
        loadRoutes()
    }, [])

    // const goToDetail = (t) => {
    //     // {tours.map(i =>{
    //     //     if(i.id === t && i.isTour === true){
    //     //         nav(`tours/${i.id}/tour-detail`)
    //     //     } 
    //     // })} 
    //     nav(`tours/${t}/tour-detail`)  
    // }

    // const url = `tours/${tourId}/tour-detail`
    // var r = new Object();
    // if(routes.id === routeId){
    //     r = routes
    // }
    // console.info(r.data)
    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
          console.log('totally custom!'),
        );
      
        return (
          <Button
            type="button"
            className="primary"
            onClick={decoratedOnClick}
          >
            {children}
          </Button>
        );
      }
    const conStyle ={
        margin: '0 auto',
        width: '70%'
    }
    
    return (
        <Container style={conStyle} className="text-center">
            <h1 className="text-center">CÁC CHUYẾN ĐI  (TUYẾN: {routeId})</h1>

            {tours.length == 0 && <Spinner animation="grow" />}
            <Accordion>
            <Row>
                {tours.map(c => {
                    return (
                        <Card style={{margin:10, padding:10}} >
                            <Item id={c.id} subject={c.subject} isTour={true}/>
                            <Card.Body>
                                <Row>
                                    <Col md={6} xs={12}>
                                        <Card.Text>Giờ khởi hành: {c.departed_time}</Card.Text>
                                        <Card.Text>Giá chuyến đi: {c.price}</Card.Text>
                                    </Col>
                                    <Col md={6} xs={12}>
                                       <Button type="submit" className="primary" onClick={() => nav(`/tours/${c.id}/tour-detail/`)  }>Chọn Chuyến Đi</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <CustomToggle eventKey={c.id} >Chi Tiết!</CustomToggle>
                                    <Accordion.Collapse eventKey={c.id}>
                                        <Row>
                                            <Col md={4} xs={12} style={{padding:1}}>
                                                <Image src={routes.image} alt={routes.subject} />
                                            </Col>
                                            <Col md={4} xs={12} style={{padding:1}}>
                                                <ListGroup variant="flush">
                                                <ListGroup.Item>Điểm khởi hành: <br/>{routes.departed_place}</ListGroup.Item>
                                                <ListGroup.Item>Ngày khởi hành: <br/>{c.departed_date}</ListGroup.Item>
                                                <ListGroup.Item>Giờ khởi hành: <br/>{c.departed_time}</ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                            <Col md={4} xs={12} style={{padding:1}}>
                                                <ListGroup variant="flush">
                                                <ListGroup.Item>Điểm đến: <br/>{routes.arrived_place}</ListGroup.Item>
                                                <ListGroup.Item>Khoảng cách: <br/>{routes.distance}</ListGroup.Item>
                                                <ListGroup.Item>Thời gian di chuyển: <br/>{routes.time_duration}</ListGroup.Item>
                                                </ListGroup>
                                            </Col>
                                            
                                        </Row>
                                    </Accordion.Collapse>
                                </Row> 
                            </Card.Body>
                        </Card> 
                    )
                    
                })}
                <Button style={{width: 100, alignItems: 'center'}} variant="primary" type="submit" onClick={()=> nav( "/")}>Quay Lại</Button>
            </Row>
            </Accordion>
        </Container>
    )
}

export default Tour