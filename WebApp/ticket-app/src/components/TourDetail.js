import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import Api, { authApi, endpoints } from "../configs/Api"
import { UserContext } from '../App'
import { Card, Col, Container, Form, Image, ListGroup, Row, Spinner } from "react-bootstrap"
import Item from "../layout/Item"
import Button from "@restart/ui/esm/Button"
import Moment from "react-moment"

const TourDetail = () => {
    const[tourDetail, setTourDetail] = useState([])
    const[comments, setComments] = useState([])
    const{tourId} = useParams()
    const [user] = useContext(UserContext)

    useEffect(() => {
        const loadTour = async () => {
            let res = null;
            if (user != null) {
                res = await authApi().get(endpoints['tour-comments'](tourId))
            } else {
                res = await Api.get(endpoints['tour-detail'](tourId))
            }
            
            setTourDetail(res.data)
        }

        loadTour()
    }, [])

    useEffect(() => {
        const loadComments = async () => {
            const res = await Api.get(endpoints['tour-comments'](tourId))
            setComments(res.data)
        }

        loadComments()
    }, [comments])

    return(
        <Container>
            <h1 className="text-center">Chi tiết chuyến đi  (chuyến: {tourId})</h1>

            {tourDetail.length == 0 && <Spinner animation="grow" />}
            
            <Row>
                {tourDetail.map(c => {
                    return (
                        <Card >
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
            <Row>
                <Col>
                    {user != null && <CommentForm tourId={tourId} comments={comments} setComments={setComments} />}
                    <ListGroup>
                        {comments.map(c => <ListGroup.Item>
                            <Image src={c.user.avatar_view} fluid width="50" roundedCircle /> {c.content} - <Moment fromNow>{c.created_date}</Moment>
                        </ListGroup.Item>)}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
    
} 
const CommentForm = ({ tourId, comments, setComments }) => {
    const [content, setContent] = useState()
    const [user] = useContext(UserContext)

    const addComment = async (event) => {
        event.preventDefault()

        const res = await authApi().post(endpoints['comments'], {
            'content': content, 
            'tour': tourId,
            'user': user.id
        })

        setComments([...comments, res.data])
    }
    return (
        <Form onSubmit={addComment}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" value={content} onChange={(evt) => setContent(evt.target.value)} placeholder="Nhap binh luan" />
            </Form.Group>
        
            <Button variant="primary" type="submit">
                Them binh luan
            </Button>
        </Form>
    )
}
export default TourDetail