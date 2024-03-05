import React, { useEffect, useState } from "react";
import { Container, Card, Button, Alert, Form } from "react-bootstrap";
import {
  firebaseDB,
  collection,
  doc,
  updateDoc,
  onSnapshot,
} from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthProvider";
import VerificationAlert from "@/components/AuthComponent/VerificationAlert";
import { convertTo12HourFormat } from "@/helper";

const ServiceTypeOptions = ["Baby Sitter", "Nanny", "Day Care"];

export default function RequestedServices() {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAuth()?.currentUser;
  const [services, setServices] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(firebaseDB, "requested-services");

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

  const handleAddToInterested = async (serviceId) => {
    const servicesRefDoc = doc(firebaseDB, "requested-services", serviceId);
    const interestedArray = servicesRefDoc.interested || [];
    await updateDoc(servicesRefDoc, {
      interested: [...interestedArray, currentUser.email],
    });
  };

  return (
    <Container className="mt-3">
      <h2>Requested Services</h2>
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
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>
                  <strong>Order:</strong> {service.order}
                  <br />
                  <strong>Start Time:</strong>{" "}
                  {convertTo12HourFormat(service.startTime)}
                  <br />
                  <strong>End Time:</strong>{" "}
                  {convertTo12HourFormat(service.endTime)}
                  <br />
                  <strong>Date:</strong> {service.date}
                  <br />
                  <strong>Price Range:</strong> {service.priceRange}
                  <br />
                  <strong>Service Type:</strong> {service.serviceType}
                  <br />
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleAddToInterested(service.id)}
                  disabled={
                    !currentUser || !currentUser?.emailVerified || isLoading
                  }
                >
                  Add to Interested
                </Button>
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
    </Container>
  );
}
