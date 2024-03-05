import { convertTo12HourFormat, deleteService } from "@/helper";
import {
  firebaseDB,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "@/lib/firebaseConfig";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Form } from "react-bootstrap";
import {
  FaCalendar,
  FaClock,
  FaDollarSign,
  FaEdit,
  FaSave,
  FaTrash,
} from "react-icons/fa";

export default function ServiceProviderProfile({ user }) {
  const [myServices, setMyServices] = useState();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(firebaseDB, "services");

        // Using onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(servicesCollection, (querySnapshot) => {
          const servicesData = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((service) => user?.postedServices?.includes(service.id));

          setMyServices(servicesData);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [user?.postedServices]);

  const [editMode, setEditMode] = useState(null); // State to track edit mode
  const [editedService, setEditedService] = useState(null); // State to track edited service

  const handleEdit = (serviceId) => {
    setEditMode(serviceId);
    // Find the service being edited and store it in the editedService state
    const serviceToEdit = myServices.find(
      (service) => service.id === serviceId
    );
    setEditedService(serviceToEdit);
  };

  const handleSave = async () => {
    try {
      // Construct the document reference
      const serviceRef = doc(firebaseDB, "services", editedService.id);

      // Update the document in the database
      await updateDoc(serviceRef, editedService);
      console.log("Service updated successfully");
      setEditMode(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the editedService state with the changed value
    setEditedService({ ...editedService, [name]: value });
  };

  return (
    <Container fluid className="mb-4">
      <h2>My Services</h2>
      <hr />

      <div className="row">
        {myServices
          ? myServices.map((service) => (
              <div key={service.id} className="col-md-4 mb-4">
                <Card>
                  {editMode === service.id ? (
                    <div className="d-flex justify-content-between m-2">
                      <Button variant="primary" onClick={handleSave}>
                        <FaSave /> Save
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end m-2">
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(service.id)}
                      >
                        <FaEdit /> Edit
                      </Button>
                    </div>
                  )}
                  <Card.Body>
                    <h2 className="d-flex justify-content-center">
                      {editMode === service.id ? (
                        <Form.Control
                          type="text"
                          name="title"
                          value={editedService.title}
                          onChange={handleChange}
                        />
                      ) : (
                        service.title
                      )}
                    </h2>

                    <div>
                      <div>
                        <h4>Details:</h4>
                        {editMode === service.id ? (
                          <Form.Control
                            as="textarea"
                            name="order"
                            value={editedService.order}
                            onChange={handleChange}
                          />
                        ) : (
                          <p>{service.order}</p>
                        )}
                      </div>
                      <div className="mb-2">
                        <strong>Service Type:</strong>{" "}
                        <Badge>{service.serviceType}</Badge>
                      </div>

                      <div className="mb-2">
                        <FaClock size={20} className="me-2" />
                        <span>
                          {editMode === service.id ? (
                            <Form.Control
                              type="text"
                              name="startTime"
                              value={editedService.startTime}
                              onChange={handleChange}
                            />
                          ) : (
                            convertTo12HourFormat(service.startTime)
                          )}{" "}
                          <span className="mx-1">-</span>
                          {editMode === service.id ? (
                            <Form.Control
                              type="text"
                              name="endTime"
                              value={editedService.endTime}
                              onChange={handleChange}
                            />
                          ) : (
                            convertTo12HourFormat(service.endTime)
                          )}
                        </span>
                      </div>
                      <div className="mb-2">
                        <FaCalendar size={20} className="me-2" />
                        {editMode === service.id ? (
                          <Form.Control
                            type="text"
                            name="date"
                            value={editedService.date}
                            onChange={handleChange}
                          />
                        ) : (
                          service.date
                        )}
                      </div>
                      <div className="mb-2">
                        <FaDollarSign size={20} className="me-2" />
                        {editMode === service.id ? (
                          <Form.Control
                            type="text"
                            name="priceRange"
                            value={editedService.priceRange}
                            onChange={handleChange}
                          />
                        ) : (
                          service.priceRange
                        )}
                      </div>
                      {editMode !== service.id && (
                        <div className="d-flex justify-content-end">
                          <Button
                            variant="danger"
                            onClick={() =>
                              deleteService("services", service.id, user.email)
                            }
                          >
                            <FaTrash /> Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          : null}
      </div>
    </Container>
  );
}
