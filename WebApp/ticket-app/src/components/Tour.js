import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Spinner, Row, Card, Button, Form } from 'react-bootstrap';
import Api, { endpoints } from '../configs/Api';
import Item from '../layout/Item';
import { useNavigate } from "react-router"

const Tour  = () => {
    const[tours, setTours] = useState([])
    const{routeId} = useParams()
    const{tourId} = useParams()
   
    useEffect(() => {
        const loadTours = async () => {
            const res = await Api.get(endpoints['tours'](routeId))
            setTours(res.data)
            
        }
        loadTours()
    }, [])
    const url = `tours/${tourId}`
    
    return (
        <Container>
            <h1 className="text-center">CÁC CHUYẾN ĐI  (TUYẾN: {routeId})</h1>

            {tours.length == 0 && <Spinner animation="grow" />}
            
            <Row>
                {tours.map(c => {
                    return (
                        <Card style={{margin:10, padding:10}} >
                            <Item id={c.id} subject={c.subject} isTour={true}/>
                            <Card.Header as="h5">{c.departed_time}</Card.Header>
                            <Card.Body>
                                <Card.Title>{c.price}</Card.Title>
                                <Card.Text>  
                                     
                                </Card.Text>
                            </Card.Body>
                        </Card> 
                    )
                    
                })}
            </Row>
        </Container>
    )
}

export default Tour