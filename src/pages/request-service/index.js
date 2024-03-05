/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Form, Row, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "@/context/AuthProvider";
import VerificationAlert from "@/components/AuthComponent/VerificationAlert";
import {
  addDoc,
  collection,
  doc,
  firebaseDB,
  getDocs,
  query,
  updateDoc,
  where,
} from "@/lib/firebaseConfig";

const ServiceTypeOptions = ["Baby Sitter", "Nanny", "Day Care"];

export default function RequestService() {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAuth()?.currentUser;
  const [form, setForm] = useState({
    title: "",
    order: "",
    date: "",
    startTime: "",
    endTime: "",
    serviceType: "",
    priceRange: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      email: currentUser?.email,
    });
  };

  const handleDropdownChange = (selectedValue) => {
    setForm({
      ...form,
      serviceType: selectedValue,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.order.trim()) {
      newErrors.order = "Details are required";
    }

    if (!form.date.trim()) {
      newErrors.date = "Date is required";
    }

    if (!form.startTime.trim() || !form.endTime.trim()) {
      newErrors.time = "Start Time and End Time are required";
    } else if (form.startTime >= form.endTime) {
      newErrors.time = "End Time should be greater than Start Time";
    }

    if (!form.serviceType) {
      newErrors.serviceType = "Please select an option";
    }

    if (!form.priceRange.trim()) {
      newErrors.priceRange = "Please set a price range";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitButton = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        setIsLoading(true);
        const serviceData = { ...form, serviceType: form.serviceType };

        const serviceRef = await addDoc(
          collection(firebaseDB, "requested-services"),
          serviceData
        );
        const userQuery = query(
          collection(firebaseDB, "users"),
          where("email", "==", currentUser.email)
        );
        const userQuerySnapshot = await getDocs(userQuery);
        const userDoc = userQuerySnapshot.docs[0];
        const userDocRef = doc(firebaseDB, "users", userDoc.id);

        // Update the "postedServices" array
        const userDocData = userDoc.data();
        const postedServicesArray = userDocData.postedServices || [];

        await updateDoc(userDocRef, {
          postedServices: [...postedServicesArray, serviceRef.id],
        });

        alert("Service post added ✔");
        setForm({
          title: "",
          order: "",
          date: "",
          startTime: "",
          endTime: "",
          serviceType: "",
          priceRange: "",
        });
        setErrors({});
        setIsLoading(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const resetButton = (e) => {
    e.preventDefault();
    setForm({
      title: "",
      order: "",
      date: "",
      startTime: "",
      endTime: "",
      serviceType: "",
      priceRange: "",
    });
    setErrors({});
  };

  return (
    <Container className="mt-3">
      <h2>Request a Service</h2>
      <hr />

      <form className="container mt-3 mb-3">
        <Row className="mb-3">
          <Form.Group controlId="formBasicTitle" className="col col-sm-12">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
            />
            {errors.title && (
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId="formGridlabel" className="col col-sm-6">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={11}
              className={`form-control ${errors.order ? "is-invalid" : ""}`}
              name="order"
              value={form.order}
              onChange={handleChange}
            />
            {errors.order && (
              <Form.Control.Feedback type="invalid">
                {errors.order}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Row className="col col-sm-6">
            <div className="col col-sm-12">
              <Form.Group
                controlId="formBasicDropdown"
                className="col col-sm-12"
              >
                <Form.Label>Select an Option</Form.Label>
                <Form.Control
                  as="select"
                  name="serviceType"
                  value={form.serviceType}
                  onChange={(e) => handleDropdownChange(e.target.value)}
                  className={`form-control ${
                    errors.serviceType ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Choose...</option>
                  {ServiceTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
                {errors.serviceType && (
                  <Form.Control.Feedback type="invalid">
                    {errors.serviceType}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group
                controlId="formBasicDate"
                className="col col-sm-12 mb-3"
              >
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  value={form.date}
                  onChange={handleChange}
                />
                {errors.date && (
                  <Form.Control.Feedback type="invalid">
                    {errors.date}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Row className="col">
                <Form.Group
                  controlId="formBasicStartTime"
                  className="col col-sm-6"
                >
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="startTime"
                    className={`form-control ${
                      errors.time ? "is-invalid" : ""
                    }`}
                    value={form.startTime}
                    onChange={handleChange}
                  />
                  {errors.time && (
                    <Form.Control.Feedback type="invalid">
                      {errors.time}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group
                  controlId="formBasicEndTime"
                  className="col col-sm-6"
                >
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    className={`form-control ${
                      errors.time ? "is-invalid" : ""
                    }`}
                    value={form.endTime}
                    onChange={handleChange}
                  />
                  {errors.time && (
                    <Form.Control.Feedback type="invalid">
                      {errors.time}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group
                  controlId="formBasicPriceRange"
                  className="col col-sm-12"
                >
                  <Form.Label>Price Range</Form.Label>
                  <Form.Control
                    type="text"
                    name="priceRange"
                    value={form.priceRange}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.priceRange ? "is-invalid" : ""
                    }`}
                  />
                  {errors.priceRange && (
                    <Form.Control.Feedback type="invalid">
                      {errors.priceRange}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Row>
            </div>
          </Row>
        </Row>
        <div className="d-flex justify-content-center text-center m-4">
          <Form.Group controlId="formGridCheckbox" className="col col-sm-6">
            <Button
              disabled={
                !currentUser || !currentUser?.emailVerified || isLoading
              }
              type="submit"
              onClick={submitButton}
              className="me-4 btn btn-success btn-lg btn-block"
            >
              {isLoading ? "Loading…" : "Submit"}
            </Button>
            <Button
              disabled={
                !currentUser || !currentUser?.emailVerified || isLoading
              }
              type="reset"
              onClick={resetButton}
              className="me-4 btn btn-danger btn-lg btn-block"
            >
              Cancel
            </Button>
          </Form.Group>
        </div>
        {!currentUser ? (
          <Alert variant="danger">
            Your are not registered. Please Register
          </Alert>
        ) : !currentUser?.emailVerified ? (
          <VerificationAlert />
        ) : null}
      </form>
    </Container>
  );
}
