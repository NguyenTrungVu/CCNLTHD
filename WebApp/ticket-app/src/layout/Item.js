import { Card, Col, Container, Row, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router"

const Item = (props) => {
    const nav = useNavigate()

    const goToTour = () => {
        if (props.isTour === true)
            nav(`/tour-detail/${props.id}`)
        else
            nav(`/routes/${props.id}/tours`)
    }

   
    return (
            // <Col md={6} xs={12} >
                <Card onClick={goToTour}>
                     <Card bg="#A0BCC2" opacity="30%" >
                        <Card.Header>{props.subject}</Card.Header>
                        
                    </Card>
                </Card>
            // </Col>

    )    
}

export default Item