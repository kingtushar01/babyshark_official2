import { Col, Container, Row } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <Container className="mt-5">
        <Row className="gy-4">
          <Col lg={5} md={12} className="footer-info">
            <div className="logo d-flex align-items-center">
              <span>BabyShark</span>
            </div>
            <p>
              Cras fermentum odio eu feugiat lide par naso tierra. Justo eget
              nada terra videa magna derita valies darta donna mare fermentum
              iaculis eu non diam phasellus.
            </p>
            <div className="social-links d-flex mt-4">
              <a href="#" className="twitter">
                <FaTwitter />
              </a>
              <a href="#" className="facebook">
                <FaFacebook />
              </a>
              <a href="#" className="instagram">
                <FaInstagram />
              </a>
              <a href="#" className="linkedin">
                <FaLinkedin />
              </a>
            </div>
          </Col>

          <Col lg={2} col={6} className="footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
            </ul>
          </Col>

          <Col lg={2} col={6} className="footer-links">
            <h4>Our Services</h4>
            <ul>
              <li>
                <a href="#">Hire Babysitter</a>
              </li>
              <li>
                <a href="#">Hire Nanny</a>
              </li>
              <li>
                <a href="#">Day care service</a>
              </li>
            </ul>
          </Col>

          <Col
            lg={3}
            md={12}
            className="footer-contact text-center text-md-start"
          >
            <h4>Contact Us</h4>
            <p>
              Amborkhana Borobazar <br />
              Sylhet,
              <br />
              Bangladesh <br />
              <br />
              <strong>Phone:</strong> +880 17123123
              <br />
              <strong>Email:</strong> info@example.com
              <br />
            </p>
          </Col>
        </Row>
      </Container>

      <Container className="mt-4">
        <div className="copyright">
          &copy; Copyright{" "}
          <strong>
            <span>BabyShark</span>
          </strong>
          . All Rights Reserved
        </div>
      </Container>
    </footer>
  );
}
