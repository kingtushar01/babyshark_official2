import React, { useEffect, useState } from "react";
import VerificationAlert from "../../components/AuthComponent/VerificationAlert";
import { useAuth } from "../../context/AuthProvider";
import {
  collection,
  firebaseDB,
  query,
  where,
  doc,
  getDocs,
  updateDoc,
} from "../../lib/firebaseConfig";
import styles from "../../styles/Profile.module.css";
import { Alert, Form } from "react-bootstrap";
import { getUserDataByEmail } from "@/helper";
import ParentsProfile from "@/components/ProfileComponent/ParentsProfile";
import ServiceProviderProfile from "@/components/ProfileComponent/ServiceProviderProfile";

export default function Profile() {
  const currentUser = useAuth().currentUser;
  const [user, setUser] = useState();

  useEffect(() => {
    async function fetchUserData() {
      const currentUserData = await getUserDataByEmail(currentUser?.email);
      setUser(currentUserData);
    }
    fetchUserData();
  }, [currentUser?.email]);

  async function toggleActiveStatus(activeStatus) {
    try {
      const usersCollection = collection(firebaseDB, "users");
      const userQuery = query(
        usersCollection,
        where("email", "==", currentUser?.email)
      );
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        const userId = userQuerySnapshot.docs[0].id;
        const userDocRef = doc(firebaseDB, "users", userId);
        await updateDoc(userDocRef, {
          active: activeStatus,
        });
        console.log(`User's active status updated successfully`);
      } else {
        console.error(`User with email ${currentUser?.email} not found`);
      }
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  }

  return (
    <div className={styles.profile_wrapper}>
      <h1 className="d-flex fw-bold justify-content-center">
        {currentUser?.displayName}
      </h1>
      {currentUser?.emailVerified && user?.userRole === "service-provider" ? (
        <div className="d-flex justify-content-end fs-4">
          <Form.Check
            type="switch"
            label="Active"
            onChange={(e) => toggleActiveStatus(e.target.checked)}
          />
        </div>
      ) : null}

      {user?.userRole === "service-provider" ? (
        <ServiceProviderProfile user={user} />
      ) : user?.userRole === "parents" ? (
        <ParentsProfile />
      ) : null}

      {!currentUser ? (
        <Alert variant="danger">Your are not registered. Please Register</Alert>
      ) : !currentUser?.emailVerified ? (
        <VerificationAlert />
      ) : null}
    </div>
  );
}
