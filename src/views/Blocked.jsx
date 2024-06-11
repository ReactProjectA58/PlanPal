export default function Blocked() {
  return (
    <div style={{ marginTop: "17rem", color: "rgb(35, 99, 23)" }}>
      <h1 style={{ color: "rgb(90, 68, 22)" }}>You are blocked</h1>
      <p>
        We're sorry, but your account has been blocked by the administrator.
      </p>
      <p>
        If you believe this is an error, please contact our support team at{" "}
        <a
          href="mailto:admin@planpal.com"
          style={{ color: "rgb(90, 68, 22)" }}
        >
          admin@reactventure.com
        </a>{" "}
        for assistance.
      </p>
      <p>
        In the meantime, you can try logging out and logging back in to see if
        the issue persists.
      </p>
      <p>Thank you for your understanding and cooperation.</p>
    </div>
  );
}
