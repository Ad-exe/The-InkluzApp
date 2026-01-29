import "../App.css";

export default function Contact() {
  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>

      <div className="contact-card">
        <p>
          <strong>Project:</strong> INKLUZ APP
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:inkluzapp@gmail.com">
            inkluzapp@gmail.com
          </a>
        </p>

        <p>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/Ad-exe/The-InkluzApp"
            target="_blank"
            rel="noreferrer"
          >
            github.com/Ad-exe/The-InkluzApp
          </a>
        </p>
      </div>
    </div>
  );
}
