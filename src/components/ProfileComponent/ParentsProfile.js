import { useAuth } from "@/context/AuthProvider";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Form } from "react-bootstrap";
import UserInfoModal from "./UserInfoModal";
import {
  collection,
  firebaseDB,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "../../lib/firebaseConfig";
import { convertTo12HourFormat, deleteService } from "@/helper";

export default function ParentsProfile() {
  const currentUser = useAuth().currentUser;
  const [postedServices, setPostedServices] = useState();
  const [interestedUser, setInterestedUser] = useState();
  const [showInterestedUserModal, setShowInterestedUserModal] = useState(false);
  const [editMode, setEditMode] = useState(null); // State to track edit mode
  const [editedService, setEditedService] = useState(null); // State to track edited service

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesCollection = collection(firebaseDB, "requested-services");

        // Using onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(servicesCollection, (querySnapshot) => {
          const servicesData = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((service) => service.email === currentUser?.email);

          setPostedServices(servicesData);
        });

        // Cleanup function to unsubscribe when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [currentUser?.email]);

  const handleEdit = (serviceId) => {
    setEditMode(serviceId);
    // Find the service being edited and store it in the editedService state
    const serviceToEdit = postedServices.find(
      (service) => service.id === serviceId
    );
    setEditedService(serviceToEdit);
  };

  const handleSave = async () => {
    try {
      // Construct the document reference
      const serviceRef = doc(
        firebaseDB,
        "requested-services",
        editedService.id
      );

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

  async function showProfile(interested) {
    try {
      const usersCollection = collection(firebaseDB, "users");
      const userQuery = query(
        usersCollection,
        where("email", "==", interested)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const interestedUserData = userQuerySnapshot.docs[0].data();
        setInterestedUser(interestedUserData);
        setShowInterestedUserModal(true);
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Handle the error appropriately in your application
    }
  }

  return (
    <div>
      <Container fluid className="mb-4">
        <h2>Requested Service</h2>
        <hr />

        {postedServices
          ? postedServices.map((service) => (
              <Card key={service.id} className="w-100">
                <Card.Body>
                  {editMode === service.id ? (
                    <div className="d-flex justify-content-between m-2">
                      <Button variant="primary" onClick={handleSave}>
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end m-2">
                      <Button
                        variant="primary"
                        onClick={() => handleEdit(service.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                  <Card.Title>
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
                  </Card.Title>
                  <div>
                    <strong>Order:</strong>{" "}
                    {editMode === service.id ? (
                      <Form.Control
                        type="text"
                        name="order"
                        value={editedService.order}
                        onChange={handleChange}
                      />
                    ) : (
                      service.order
                    )}
                  </div>
                  <div>
                    <strong>Start Time:</strong>{" "}
                    {editMode === service.id ? (
                      <Form.Control
                        type="text"
                        name="startTime"
                        value={editedService.startTime}
                        onChange={handleChange}
                      />
                    ) : (
                      convertTo12HourFormat(service.startTime)
                    )}
                  </div>
                  <div>
                    <strong>End Time:</strong>{" "}
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
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
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
                  <div>
                    <strong>Interested:</strong>
                    <div className="d-flex flex-wrap">
                      {service?.interested?.map((interested) => (
                        <div
                          key={interested}
                          className="m-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => showProfile(interested)}
                        >
                          <Badge>{interested}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  {editMode !== service.id && (
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() =>
                          deleteService(
                            "requested-services",
                            service.id,
                            currentUser?.email
                          )
                        }
                      >
                        Delete Service
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))
          : null}
      </Container>
      {showInterestedUserModal ? (
        <UserInfoModal
          showModal={showInterestedUserModal}
          handleModalClose={handleUserInfoModalClose}
          setShowModal={setShowInterestedUserModal}
          data={interestedUser}
        />
      ) : null}
    </div>
  );
}
