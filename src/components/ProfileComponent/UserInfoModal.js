import { useAuth } from "@/context/AuthProvider";
import { getUserDataByEmail } from "@/helper";
import {
  collection,
  doc,
  firebaseDB,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@/lib/firebaseConfig";
import React, { useEffect, useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";

export default function UserInfoModal({
  showModal,
  handleModalClose,
  setShowModal,
  data,
}) {
  const currentUser = useAuth();
  const [user, setUser] = useState();
  useEffect(() => {
    async function fetchUserData() {
      const currentUserData = await getUserDataByEmail(currentUser?.email);
      setUser(currentUserData);
    }
    fetchUserData();
  }, [currentUser?.email]);

  const addedRating = async (rating) => {
    if (user?.userRole === "parents") {
      try {
        const usersCollection = collection(firebaseDB, "users");
        const userQuery = query(
          usersCollection,
          where("email", "==", data?.email)
        );
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userId = userQuerySnapshot.docs[0].id;
          const prevRating = userQuerySnapshot.docs[0].data().rating ?? 0;
          const userDocRef = doc(firebaseDB, "users", userId);
          const newRating = (prevRating + rating) / 2;
          await updateDoc(userDocRef, {
            rating: prevRating === 0 ? rating : newRating,
          });
          console.log(`User's rating updated successfully`);
        } else {
          console.error(`User with email ${data?.email} not found`);
        }
      } catch (error) {
        console.error("Error updating rating :", error);
      }
    } else {
      alert("Only parents can add feedback");
    }
  };
  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Name:</strong>
          <span> {data?.name}</span>
          <span className="ms-2">
            {data?.active ? (
              <OverlayTrigger
                overlay={<Tooltip id="tooltip-disabled">Not Available</Tooltip>}
              >
                <span className="d-inline-block">🔴</span>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                overlay={<Tooltip id="tooltip-disabled">Available</Tooltip>}
              >
                <span className="d-inline-block">🟢</span>
              </OverlayTrigger>
            )}
          </span>
        </p>
        <p>
          <strong>Email:</strong> {data?.email}
        </p>
        <p>
          <strong>Phone:</strong> {data?.phone}
        </p>
        <p>
          <strong>Address:</strong> {data?.address}
        </p>
        <p>
          <strong>Nid:</strong> {data?.nid}
        </p>

        <strong>Add a Feedback</strong>
        <div className="d-flex align-items-center">
          <ReactStars
            count={5}
            value={data?.rating ?? 0}
            onChange={addedRating}
            size={40}
            isHalf={true}
            activeColor="#ffd700"
          />
          <div className="ms-2 fs-5 font-weight-bold">
            {data.rating ?? 0} / 5
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
