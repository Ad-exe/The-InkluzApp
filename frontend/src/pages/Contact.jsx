import "../App.css";

export default function Contact() {
  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>

      <div className="contact-card">
        <p>
          <strong>Project Name:</strong> INKLUZ APP
        </p>

        <p>
          <strong>Description:</strong> An inclusive AI-based application that
          converts hand gestures into text and speech for better communication.
        </p>

        <p>
          <strong>Developer:</strong> Adithya Chowdary
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:adityachowdarybotla@gmail.com">
            adityachowdarybotla@gmail.com
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

        <p>
          <strong>University:</strong> SRM Institute of Science and Technology
        </p>
      </div>
    </div>
  );
}
