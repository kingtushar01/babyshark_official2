/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

export default function AboutUs() {
  return (
    <section id="about" className="about">
      <Container data-aos="fade-up">
        <div className="section-header">
          <h2>About Us</h2>
        </div>

        <Row className="gy-4">
          <Col lg={6}>
            <h3>Book your services any time for your little one</h3>
            <Image
              src="/assets/img/book-service-about.jpg"
              className="img-fluid rounded-4 mb-4"
              alt=""
              width={500}
              height={500}
            />
            <p>
              At BabyShark, we understand that parents deserve a stress-free
              experience when it comes to securing dependable childcare. Our
              simplified process ensures that you can quickly connect with
              experienced babysitters and dedicated nannies, providing you with
              peace of mind and flexibility.
            </p>
          </Col>
          <Col lg={6}>
            <div className="content ps-0 ps-lg-5">
              <h3>Work for us and Earn </h3>
              <p className="fst-italic">
                We're not just a service for parents – we're also a welcoming
                community for passionate individuals looking to join as
                babysitters, nannies, or daycare providers. If you have a
                genuine love for caring for children, BabyShark provides an easy
                avenue for you to transform your skills into a fulfilling source
                of income.
              </p>

              <div className="position-relative mt-4">
                <Image
                  src="/assets/img/babysitter-about.jpg"
                  className="img-fluid rounded-4"
                  alt=""
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
