import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthProvider";

export default function ForgotPasswordModal({
  showModal,
  handleModalClose,
  setShowModal,
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await resetPassword(email)
        .then(() => {
          alert(`A password reset Email has been sent to ${email}`);
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
      setIsLoading(false);
    }
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password? </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmailForgot">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-center my-2">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Loading…" : "Reset Password"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
