import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthProvider";

export default function SignInModal({
  showModal,
  handleModalClose,
  setShowModal,
  setShowCAModal,
  setShowFPModal,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login(email, password)
        .then(() => {
          setShowModal(false);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      // Reset form
      setEmail("");
      setPassword("");
      setIsLoading(false);
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex mt-2 justify-content-end">
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setShowModal(false);
                setShowFPModal(true);
              }}
            >
              Forgot password?
            </span>
          </div>
          <div className="d-flex justify-content-center my-2">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading…" : "Sign In"}
            </Button>
          </div>

          <div className="d-flex justify-content-center">
            <span className="me-2">Don&apos;t Have an account? </span>
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                setShowModal(false);
                setShowCAModal(true);
              }}
            >
              Create an account
            </span>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
