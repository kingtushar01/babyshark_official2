import { Container, Row, Col } from "react-bootstrap";
import { FaBabyCarriage } from "react-icons/fa";
import { GiBabyBottle } from "react-icons/gi";
import { MdOutlineBabyChangingStation } from "react-icons/md";

export default function OurServices() {
  return (
    <section id="services" className="services sections-bg">
      <Container data-aos="fade-up">
        <div className="section-header">
          <h2>Our Services</h2>
        </div>

        <Row className="gy-4" data-aos="fade-up" data-aos-delay="100">
          <Col lg={4} md={6}>
            <div className="service-item position-relative">
              <div className="icon">
                <i>
                  <GiBabyBottle />
                </i>
              </div>
              <h3>Hiring Babysitter</h3>
              <p>
                Provident nihil minus qui consequatur non omnis maiores. Eos
              </p>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="service-item position-relative">
              <div className="icon">
                <i>
                  <MdOutlineBabyChangingStation />
                </i>
              </div>
              <h3>Hiring Nanny</h3>
              <p>
                Ut autem aut autem non a. Sint sint sit facilis nam iusto sint.
                Libero corrupti neque eum hic non ut nesciunt dolorem.
              </p>
            </div>
          </Col>

          <Col lg={4} md={6}>
            <div className="service-item position-relative">
              <div className="icon">
                <i>
                  <FaBabyCarriage />
                </i>
              </div>
              <h3>Day Care Service</h3>
              <p>
                Ut excepturi voluptatem nisi sed. Quidem fuga consequatur. Minus
                ea aut. Vel qui id voluptas adipisci eos earum corrupti.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
