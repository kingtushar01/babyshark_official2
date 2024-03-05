import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AiOutlineSafety } from "react-icons/ai";
import { FaHandsHelping } from "react-icons/fa";
import { MdOutlineBookmarkAdded, MdOutlineFindInPage } from "react-icons/md";

export default function HeroSection() {
  return (
    <section id="hero" className="hero">
      <Container className="position-relative">
        <Row className="gy-5" data-aos="fade-in">
          <Col
            lg={6}
            order={2}
            orderLg={1}
            className="d-flex flex-column justify-content-center text-center text-lg-start"
          >
            <h2 className="font-3xl">Baby Shark</h2>
            <p>
              BabyShark platform makes it easier and more efficient for parents
              to find and book high-quality childcare services,while also
              providing providers with a platform to connect with new clients
              and grow their business.
            </p>
            <div className="d-flex justify-content-center justify-content-lg-start">
              <Link
                href="/services"
                className="btn-get-started text-decoration-none"
              >
                Services
              </Link>
            </div>
          </Col>
          <Col lg={6} order={1} orderLg={2}>
            <div className="d-flex justify-content-center">
              <Image
                src="/assets/img/babybg.svg" // Update the path based on your Next.js project structure
                className="img-fluid"
                alt="hero-img"
                data-aos="zoom-out"
                data-aos-delay={100}
                width={500} // Set the width based on your design
                height={500} // Set the height based on your design
              />
            </div>
          </Col>
        </Row>
      </Container>

      <div className="icon-boxes position-relative">
        <Container className="position-relative">
          <Row className="gy-4 mt-5">
            <Col xl={3} md={6} data-aos="fade-up" data-aos-delay={100}>
              <div className="icon-box">
                <div className="icon">
                  <MdOutlineFindInPage />
                </div>
                <h4 className="title">
                  <div className="text-white">Find Babysitter</div>
                </h4>
              </div>
            </Col>

            <Col xl={3} md={6} data-aos="fade-up" data-aos-delay={200}>
              <div className="icon-box">
                <div className="icon">
                  <AiOutlineSafety />
                </div>
                <h4 className="title">
                  <div className="text-white">Safety First</div>
                </h4>
              </div>
            </Col>

            <Col xl={3} md={6} data-aos="fade-up" data-aos-delay={300}>
              <div className="icon-box">
                <div className="icon">
                  <MdOutlineBookmarkAdded />
                </div>
                <h4 className="title">
                  <div className="text-white">Flexible Booking</div>
                </h4>
              </div>
            </Col>

            <Col xl={3} md={6} data-aos="fade-up" data-aos-delay={500}>
              <div className="icon-box">
                <div className="icon">
                  <FaHandsHelping />
                </div>
                <h4 className="title">
                  <div className="text-white">Provide Help & Earn</div>
                </h4>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
}

/*





*/
