import { Card, Col, Container, Row, Spinner, Button } from "react-bootstrap"
import { useNavigate } from "react-router"

const Item = (props) => {
    const nav = useNavigate()

    const goToTour = () => {
            nav(`/routes/${props.id}/tours`)
       
        
    }

   const cardStyle ={
       backgroundColor: '#FEFFDE',
       color: '#52734D',
       border: "success",
   }
    return (
            // <Col md={6} xs={12} >
                <Card onClick={goToTour}>
                     <Card style={cardStyle}>
                        <Card.Header style={{fontSize:30}}>{props.subject}</Card.Header>
                        
                    </Card>
                </Card>
            // </Col>

    )    
}

export default Item