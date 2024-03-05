import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthProvider";
import { addDoc, collection, firebaseDB } from "../../lib/firebaseConfig";

export default function CreateAccountModal({
  showModal,
  handleModalClose,
  setShowModal,
}) {
  const route = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [nid, setNid] = useState("");
  const [userRole, setUserRole] = useState("parents"); // Default role is parents

  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await signUp(email, password, name)
        .then(async () => {
          const usersCollection = collection(firebaseDB, "users");
          await addDoc(usersCollection, {
            name,
            email,
            phone,
            address,
            nid,
            userRole,
          });
          setShowModal(false);
          route.push("/profile");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      alert(error.message);
    } finally {
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setNid("");
      setUserRole("parents");
      setIsLoading(false);
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="userRole">
            <Form.Label>User Role</Form.Label>
            <Form.Control
              as="select"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="parents">Parents</option>
              <option value="service-provider">Service Provider</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              required
              type="tel"
              placeholder="Enter your Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="nid">
            <Form.Label>NID</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your NID"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-center my-2">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading…" : "Create Account"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
