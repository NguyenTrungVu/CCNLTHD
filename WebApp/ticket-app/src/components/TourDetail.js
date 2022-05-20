import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams, useHistory } from "react-router"
import Api, { authApi, endpoints } from "../configs/Api"

import { UserContext } from '../App'
import { Card, Col, Container, Form, Image, ListGroup, Row, Spinner, Button, InputGroup, FormControl, FloatingLabel, Accordion, AccordionContext, useAccordionButton } from "react-bootstrap"
import Item from "../layout/Item"
import Moment from "react-moment"
import momo from "../image/MoMo_Logo.png"
import moca from "../image/Moca-Logo.png"

const TourDetail = () => {
    const[tourDetail, setTourDetail] = useState(null)
    const[comments, setComments] = useState([])
    const[tours, setTours] = useState(null)
    const{tourId} = useParams()
    const [user] = useContext(UserContext)
    
    const nav = useNavigate()
    

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
   
    useEffect(() => {
        const loadTours = async () => {
            const res = await Api.get(endpoints['tour'](tourId))
            setTours(res.data)
            console.info(res.data)
        }
        loadTours()
    }, [])

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
    
   
    return(
        <Container>
            <h1 className="text-center">Chi tiết chuyến đi  (chuyến: {tourId})</h1>
            <Row>
                Thông tin chuyến xe
            </Row>
            <Card>
                 <Row>
                <h4>Thông tin khách hàng</h4>
                
                    <Col md={3} xs={12}>
                    <Form.Label htmlFor="basic-url">Họ</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                    </Col>
                    <Col md={3} xs={12}>
                    <Form.Label htmlFor="basic-url">Đệm & Tên</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                    </Col>
                    <Col md={3} xs={12}>
                    <Form.Label htmlFor="basic-url">Số điện thoại</Form.Label>
                    <InputGroup className="mb-3">
                        <FormControl id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                    </Col>
                    <Col md={3} xs={12}>
                    <Form.Label>Vị Trí ghê</Form.Label>
                    
                    <Form.Select aria-label="Floating label select example">
                        <option>Vị trí ghế</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                    
                    </Col>
                </Row>
            </Card>
            <Card>
                 <h4>Phương thức thanh toán</h4>
                 <Row>
                    <Accordion >
                        <Card>
                        <Card.Header>
                            <CustomToggle eventKey="0">THANH TOÁN TẠI QUẦY VÉ</CustomToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>ĐỊA CHỈ QUẦY VÉ: 12/21 BÀNH VĂN TRÂN, P7, Q.TÂN BÌNH, HCM <br/>ĐỊA CHỈ QUẦY VÉ: 123 PHẠM VĂN ĐỒNG, P.THỐNG NHẤT, KON TUM<br/>HOT LINE: 3023749237</Card.Body>
                            
                        </Accordion.Collapse>
                        </Card>
                        <Card>
                        <Card.Header>
                            <CustomToggle eventKey="1">THANH TOÁN QUA VÍ ĐIỆN TỬ</CustomToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Card.Text>
                                <Form>
                                    <Row>
                                        <Col xs={6} md ={3} className="d-flex">
                                            <Form.Check
                                                inlines      
                                                name="group1"
                                                type="radio"
                                            />
                                            <Image style={{marginLeft: 10, width:100}} src={moca}/> 
                                        </Col>
                                        <Col xs={6} md ={3} className="d-flex">
                                            <Form.Check
                                                inlines      
                                                name="group1"
                                                type="radio"
                                            />
                                            <Image style={{marginLeft: 10, width:100}} src={momo}/> 
                                        </Col>
                                    </Row>
                                    </Form>
                                </Card.Text>
                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                    </Accordion>
                 </Row>
                 <Row>
                     <Col md={6} xs={12}><Button variant="primary" type="submit" onClick={()=> nav(`/routes/${tours.route}/tours`)}>Quay Lại</Button></Col>
                     <Col md={6} xs={12} style={{alignItems: 'right'}}><Button variant="primary">Đặt Vé</Button></Col>
                 </Row>
            </Card>
           
            {/* <Row>
                <Col>
                    {user != null && <CommentForm tourId={tourId} comments={comments} setComments={setComments} />}
                    <ListGroup>
                        {comments.map(c => <ListGroup.Item>
                            <Image src={c.user.avatar_view} fluid width="50" roundedCircle /> {c.content} - <Moment fromNow>{c.created_date}</Moment>
                        </ListGroup.Item>)}
                    </ListGroup>
                </Col>
            </Row> */}
        </Container>
    )
    
} 
// const CommentForm = ({ tourId, comments, setComments }) => {
//     const [content, setContent] = useState()
//     const [user] = useContext(UserContext)

//     const addComment = async (event) => {
//         event.preventDefault()

//         const res = await authApi().post(endpoints['comments'], {
//             'content': content, 
//             'tour': tourId,
//             'user': user.id
//         })

//         setComments([...comments, res.data])
// //     }
//     return (
//         // <Form onSubmit={addComment}>
//         //     <Form.Group className="mb-3" controlId="formBasicEmail">
//         //         <Form.Control type="text" value={content} onChange={(evt) => setContent(evt.target.value)} placeholder="Nhap binh luan" />
//         //     </Form.Group>
        
//         //     <Button variant="primary" type="submit">
//         //         Them binh luan
//         //     </Button>
//         // </Form>
//     )
// }
export default TourDetail