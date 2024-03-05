import React, { useEffect, useState } from "react";
import { Container, Card, Button, Alert, Form, Badge } from "react-bootstrap";
import {
  firebaseDB,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthProvider";
import VerificationAlert from "@/components/AuthComponent/VerificationAlert";
import { convertTo12HourFormat, getUserDataByEmail } from "@/helper";
import { FaCalendar, FaClock, FaDollarSign } from "react-icons/fa";
import UserInfoModal from "@/components/ProfileComponent/UserInfoModal";

const ServiceTypeOptions = ["Baby Sitter", "Nanny", "Day Care"];

export default function Services() {
  const currentUser = useAuth()?.currentUser;
  const [services, setServices] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [showInterestedUserModal, setShowInterestedUserModal] = useState(false);
  const [interestedUser, setInterestedUser] = useState();

  const handleUserInfoModalClose = () => {
    setShowInterestedUserModal(false);
  };

  async function showProfile(interested) {
    const interestedUserData = await getUserDataByEmail(interested);
    setInterestedUser(interestedUserData);
    setShowInterestedUserModal(true);
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(firebaseDB, "services");

        // Using onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(servicesCollection, (querySnapshot) => {
          const servicesData = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
              (service) => !service.interested?.includes(currentUser?.email)
            )
            .filter(
              (service) =>
                !selectedServiceType ||
                service.serviceType === selectedServiceType
            ); // Filter based on selected service type

          setServices(servicesData);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [currentUser, selectedServiceType]);

  return (
    <Container className="mt-3">
      <h2>Services</h2>
      <hr />

      <div className="d-flex justify-content-end m-3">
        <Form.Group controlId="serviceTypeDropdown">
          <Form.Label>Filter by Service Type:</Form.Label>
          <Form.Control
            as="select"
            value={selectedServiceType}
            onChange={(e) => setSelectedServiceType(e.target.value)}
          >
            <option value="">All</option>
            {ServiceTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      <div className="row">
        {services.map((service) => (
          <div key={service.id} className="col-md-4 mb-4">
            <Card>
              <Card.Body>
                <h2 className="d-flex justify-content-center">
                  {service.title}
                </h2>
                <div>
                  <div>
                    <h4>Details:</h4> <p>{service.order}</p>
                  </div>
                  <div className="mb-2">
                    <strong>Service Type:</strong>{" "}
                    <Badge>{service.serviceType}</Badge>
                  </div>

                  <div className="mb-2">
                    <FaClock size={20} className="me-2" />
                    <span>
                      {convertTo12HourFormat(service.startTime)}{" "}
                      <span className="mx-1">-</span>
                      {convertTo12HourFormat(service.endTime)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <FaCalendar size={20} className="me-2" />
                    {service.date}
                  </div>
                  <div className="mb-2">
                    <FaDollarSign size={20} className="me-2" />
                    {service.priceRange}
                  </div>
                  <div className="d-flex justify-content-center">
                    <Button onClick={() => showProfile(service.email)}>
                      View Information
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {!currentUser ? (
        <Alert variant="danger">Your are not registered. Please Register</Alert>
      ) : !currentUser?.emailVerified ? (
        <VerificationAlert />
      ) : null}
      {showInterestedUserModal ? (
        <UserInfoModal
          showModal={showInterestedUserModal}
          handleModalClose={handleUserInfoModalClose}
          setShowModal={setShowInterestedUserModal}
          data={interestedUser}
        />
      ) : null}
    </Container>
  );
}
