import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { AiFillHome } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import {
  MdBookmarkAdd,
  MdPersonSearch,
  MdChildCare,
  MdDashboard,
} from "react-icons/md";
import { useAuth } from "../context/AuthProvider";
import CreateAccountModal from "./AuthComponent/CreateAccountModal";
import ForgotPasswordModal from "./AuthComponent/ForgotPasswordModal";
import SignInModal from "./AuthComponent/SignInModal";
import {
  collection,
  firebaseDB,
  getDocs,
  query,
  where,
} from "../lib/firebaseConfig";

export default function Header() {
  const auth = useAuth();
  const { logOut } = useAuth();
  const currentUser = auth.currentUser;
  const router = useRouter();

  const [showCAModal, setShowCAModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showFPModal, setShowFPModal] = useState(false);

  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser?.email) {
          const q = query(
            collection(firebaseDB, "users"),
            where("email", "==", currentUser?.email)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserData(userData);
          } else {
            console.log("User data not found in Firestore.");
          }
        } else {
          console.log("currentUser.email is undefined or null.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser?.email]);

  const handleCAModalClose = () => {
    setShowCAModal(false);
  };
  const handleSignInModalClose = () => {
    setShowSignInModal(false);
  };
  const handleFPModalClose = () => {
    setShowFPModal(false);
  };

  const handleLogout = () => {
    try {
      logOut(auth)
        .then((response) => {
          router.push("/");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="justify-content-end"
        style={{ backgroundColor: "#008374" }}
      >
        <Container>
          <Link href="/">
            <Navbar.Brand>
              <Image
                src="/logo.png"
                width="80"
                height="65"
                className="d-inline-block align-top"
                alt="Logo"
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav ">
            <Nav className="ml-auto d-flex justify-content-around w-100">
              <div className="d-flex justify-content-around w-100 w-md-75">
                {userData?.userRole === "parents" ? (
                  <>
                    <Link className="nav-link text-white" href="/">
                      <div className="text-center">
                        <AiFillHome size="30px" />
                        <div>Home</div>
                      </div>
                    </Link>
                    <Link
                      className="nav-link text-white"
                      href="/request-service"
                    >
                      <div className="text-center">
                        <MdBookmarkAdd size="30px" />
                        <div>Request Service</div>
                      </div>
                    </Link>
                    <Link className="nav-link text-white" href="/services">
                      <div className="text-center">
                        <MdChildCare size="30px" />
                        <div>Services</div>
                      </div>
                    </Link>
                  </>
                ) : userData?.userRole === "service-provider" ? (
                  <>
                    <Link className="nav-link text-white" href="/">
                      <div className="text-center">
                        <AiFillHome size="30px" />
                        <div>Home</div>
                      </div>
                    </Link>
                    <Link
                      className="nav-link text-white"
                      href="/requested-services"
                    >
                      <div className="text-center">
                        <MdPersonSearch size="30px" />
                        <div>Requested Services</div>
                      </div>
                    </Link>

                    <Link className="nav-link text-white" href="/add-service">
                      <div className="text-center">
                        <MdBookmarkAdd size="30px" />
                        <div>Add Service</div>
                      </div>
                    </Link>
                    <Link className="nav-link text-white" href="/services">
                      <div className="text-center">
                        <MdChildCare size="30px" />
                        <div>Services</div>
                      </div>
                    </Link>
                  </>
                ) : userData?.userRole === "admin" ? (
                  <Link className="nav-link text-white" href="/dashboard">
                    <div className="text-center">
                      <MdDashboard size="30px" />
                      <div>Dashboard</div>
                    </div>
                  </Link>
                ) : null}
              </div>
              <hr className="d-md-none text-white-150"></hr>
              <div className="d-flex text-white justify-content-center align-items-center md-w-25 w-100 justify-content-md-end">
                {currentUser ? (
                  <>
                    <Link
                      className="text-center me-4"
                      style={{
                        cursor: "pointer",
                        color: "white",
                        textDecoration: "none",
                      }}
                      href="/profile"
                    >
                      <FaUserAlt size="30px" />{" "}
                      <div>{currentUser.displayName}</div>
                    </Link>
                    <div>
                      <Button
                        variant="light"
                        className="ms-4"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center me-4">
                      <Button
                        variant="light"
                        onClick={() => setShowSignInModal(true)}
                      >
                        Sign In
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="light"
                        onClick={() => setShowCAModal(true)}
                      >
                        Create Account
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showCAModal ? (
        <CreateAccountModal
          showModal={showCAModal}
          handleModalClose={handleCAModalClose}
          setShowModal={setShowCAModal}
        />
      ) : null}
      {showSignInModal ? (
        <SignInModal
          showModal={showSignInModal}
          handleModalClose={handleSignInModalClose}
          setShowModal={setShowSignInModal}
          setShowCAModal={setShowCAModal}
          setShowFPModal={setShowFPModal}
        />
      ) : null}
      {showFPModal ? (
        <ForgotPasswordModal
          showModal={showFPModal}
          handleModalClose={handleFPModalClose}
          setShowModal={setShowFPModal}
        />
      ) : null}
    </>
  );
}
