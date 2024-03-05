import { sendEmailVerification } from "firebase/auth";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "../../context/AuthProvider";

export default function VerificationAlert() {
  const currentUser = useAuth()?.currentUser;
  return (
    <Alert variant="danger">
      An Email has been sent to <b>{currentUser?.email}</b>. Verify to continue.
      <b
        style={{ cursor: "pointer" }}
        onClick={() => {
          sendEmailVerification(currentUser);
          alert("Email Resend. Check your email ✔");
        }}
      >
        {" "}
        Resend Email?
      </b>
    </Alert>
  );
}
