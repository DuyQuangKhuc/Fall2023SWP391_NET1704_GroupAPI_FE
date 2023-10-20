import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container >
        <Col className='text-center py-3'>
          <p>Bird Cage Shop &copy; {currentYear}</p>
        </Col>
      </Container>
    </footer>
  );
};
export default Footer;