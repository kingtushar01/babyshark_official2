import { collection, firebaseDB, getDocs } from "@/lib/firebaseConfig";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Card,
  Container,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const UserTypeOptions = ["admin", "service-provider", "parents"];

export default function Dashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firebaseDB, "users");
        const usersQuerySnapshot = await getDocs(usersCollection);

        const usersData = usersQuerySnapshot.docs
          .map((doc) => doc.data())
          .filter(
            (user) => !selectedUserType || user.userRole === selectedUserType
          );
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    fetchUsers();
  }, [selectedUserType]);

  return (
    <Container className="mt-3">
      <div>
        <h2>All Users</h2>
        <hr />
        <div className="d-flex justify-content-end m-3">
          <Form.Group controlId="userTypeDropdown">
            <Form.Label>Filter by Service Type:</Form.Label>
            <Form.Control
              as="select"
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
            >
              <option value="">All</option>
              {UserTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="row">
          {allUsers.map((user) => (
            <div key={user?.email} className="col-md-4 mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <Card.Title>{user?.name}</Card.Title>
                    <div>
                      {user?.userRole === "service-provider" ? (
                        user?.active ? (
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">
                                Not Available
                              </Tooltip>
                            }
                          >
                            <span className="d-inline-block">🔴</span>
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-disabled">Available</Tooltip>
                            }
                          >
                            <span className="d-inline-block">🟢</span>
                          </OverlayTrigger>
                        )
                      ) : null}
                    </div>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted">
                    <Badge>{user?.userRole}</Badge>
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Email:</strong> {user?.email}
                    <br />
                    <strong>Phone:</strong> {user?.phone}
                    <br />
                    <strong>Nid:</strong> {user?.nid}
                    <br />
                    <strong>Address:</strong> {user?.address}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
