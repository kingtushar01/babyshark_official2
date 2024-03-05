import {
  collection,
  firebaseDB,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  getDocs,
  arrayRemove,
  updateDoc,
} from "./lib/firebaseConfig";

export function convertTo12HourFormat(time) {
  const [hours, minutes] = time.split(":").map(Number);

  // Check if it's midnight (00:00) or noon (12:00)
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;

  // Format the time
  const formattedTime = `${hours12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return formattedTime;
}

export async function getUserDataByEmail(currentUserEmail) {
  try {
    const usersCollection = collection(firebaseDB, "users");
    const userQuery = query(
      usersCollection,
      where("email", "==", currentUserEmail)
    );
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      const currentUserData = userQuerySnapshot.docs[0].data();
      return currentUserData;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; // Handle the error appropriately in your application
  }
}

export async function deleteService(serviceCollection, serviceId, userEmail) {
  try {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!isConfirmed) {
      return;
    }

    const serviceDocRef = doc(firebaseDB, serviceCollection, serviceId);

    await deleteDoc(serviceDocRef);
    console.log(`Service with ID ${serviceId} deleted successfully`);

    const usersCollection = collection(firebaseDB, "users");
    const userQuery = query(usersCollection, where("email", "==", userEmail));
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      const userDocRef = doc(firebaseDB, "users", userQuerySnapshot.docs[0].id);
      await updateDoc(userDocRef, {
        postedServices: arrayRemove(serviceId),
      });
      console.log(
        `Service removed from 'postedServices' array in the user document`
      );
    } else {
      console.error(`User with email ${userEmail} not found`);
    }
  } catch (error) {
    console.error("Error fetching services:", error);
  }
}
