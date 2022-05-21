import { useContext, useEffect, useState } from "react"
import { Col, Container, Form, Image, ListGroup, Row, Button, Card, Spinner} from "react-bootstrap"
import Moment from "react-moment"
import { useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { UserContext } from "../App"
import Api, { authApi, endpoints } from "../configs/Api"
import Item from "../layout/Item"



const TourComment = () => {
    const[comments, setComments] = useState([])
    const[t, setT] = useState(null)
    const [commentContent, setCommentContent] = useState(null)
    let{tourId} = useParams()
    const [user] = useContext(UserContext)
    const nav = useNavigate()

    useEffect (() => {
        const loadT = async () => {
            try{
                let res = await Api.get(endpoints['tour'](tourId))
                setT(res.data)
            }catch(e){
                console.error(e)
            } 
        }
        loadT()
    }, [])
    
    useEffect(() => {
        const loadComments = async () => {
               const res = await Api.get(endpoints['tour-comments'](tourId))
            setComments(res.data)
            
        }
        loadComments()
    }, [comments])
    if(t===null) {
               return  <Spinner animation="grow" />
             }
    const style ={
        margin: 10
    }
    const addComment = async (event) => {
        event.preventDefault();
        try{
            let res = await authApi().post(endpoints['comments'](tourId), {
                "content": commentContent
            })
            console.info(res.data)
            comments.push(res.data)
            setComments(comments)
        }catch(e){
            console.error(e)
        }
    }
    let cmt = <em><Link to="/login" >Đăng nhập để bình luận</Link></em>
    if( user!== null && user !== undefined){
        cmt = <Form onSubmit={addComment}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Bình Luận</Form.Label>
                    <Form.Control as="textarea"
                    value = {commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                    placeholder="Nhap binh luan..." />
                </Form.Group>
                <Row>
                    <Col><Button variant="primary" type="submit">
                    Thêm bình luận
                </Button></Col>
                <Col> <Button style={{width: 100, alignItems: 'center'}} variant="primary" type="submit" onClick={()=> nav( "/")}>Quay Lại</Button></Col>
                </Row>
                
            </Form>
        
    }
    const rowStyle ={
        width: 800, 
        backgroundColor: '#99DDCC'
    }
    return (
        
        <Container>
             <h1 className="text-center" style={style}>CÁC PHẢN HỒI VỀ CHUYẾN XE</h1>
             
            <Row > 
                <Card style={rowStyle} >
                    <Card.Title className="text-center">{t.subject}</Card.Title>
                    <Card.Body>
                        <Row>
                            <Col md={6} xs={12}>
                                <Card.Text>Ngày khởi hành: {t.departed_date}</Card.Text>
                                <Card.Text>Giờ khởi hành: {t.departed_time}</Card.Text>
                                <Card.Text>Giá chuyến đi: {t.price}</Card.Text>
                            </Col>
                        </Row> 
                    </Card.Body>
                </Card> 
                
            </Row> 
            <hr/>
            {cmt}
             <hr/>
               {comments.map(c =>{
                   return (
                       <Row style={style}>
                           <Col md={2} xs={12} className="d-flex">
                                <Image src={c.user.avatar} fluid width="40" height="30" roundedCircle ></Image> 
                                {c.user.username}
                            </Col>
                            <Col md={10} xs={12}>
                                 {c.content}<br/><Moment fromNow>{c.created_date}</Moment>
                            </Col>
                        </Row>
                   )
                   
               })}      
        </Container>
    )
}
export default TourComment

