import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import Api, { authApi, endpoints } from "../configs/Api"
import { UserContext } from '../App'
import { Card, Col, Container, Form, Image, ListGroup, Row, Spinner, Button } from "react-bootstrap"
import Item from "../layout/Item"
import Moment from "react-moment"

const TourDetail = () => {
    const[tourDetail, setTourDetail] = useState(null)
    const[comments, setComments] = useState([])
    const{tourId} = useParams()
    const [user] = useContext(UserContext)

    useEffect(() => {
        const loadTour = async () => {
            let res = null;
            if(user !== null){
                res = await authApi().get(endpoints['tour-comments'](tourId))
            }
            else
                res = await Api.get(endpoints['tour-detail'](tourId))
            
            setTourDetail(res.data)
            console.info(res.data)
        }

        loadTour()
    }, [])

    useEffect(() => {
        const loadComments = async () => {
               const res = await authApi().get(endpoints['tour-comments'](tourId))
            setComments(res.data)
        }
        loadComments()
    }, [comments])
    
    return(
        <Container>
            <h1 className="text-center">Chi tiết chuyến đi  (chuyến: {tourId})</h1>
            <Row>
                <Col md={6} xs={12}>
                    {/* <Card.Text>Giờ khởi hành: {tourDetail.departed_time}</Card.Text>
                    <Card.Text>Giá chuyến đi: {tourDetail.price}</Card.Text> */}
                </Col>
                {/* <Col md={6} xs={12}>
                    <Button type="submit" className="primary" >Chọn Chuyến Đi</Button>
                </Col> */}
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