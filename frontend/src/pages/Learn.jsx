import { useNavigate } from "react-router-dom";

export default function Learn() {
  const navigate = useNavigate();

  const videos = [
    { id: "a", src: "/videos/a.mp4" },
    { id: "b", src: "/videos/b.mp4" },
    { id: "c", src: "/videos/c.mp4" },
    { id: "d", src: "/videos/d.mp4" },
    { id: "e", src: "/videos/e.mp4" },
    { id: "f", src: "/videos/f.mp4" },
  ];

  const practice = (id) => {
    navigate("/sign-to-text", {
      state: { practiceTarget: id.toUpperCase() },
    });
  };

  return (
    <div className="container">
      <h1 className="page-title">Sign Language Learning Videos</h1>

      <div className="video-grid">
        {videos.map((v) => (
          <div className="video-card" key={v.id}>
            <video src={v.src} controls preload="metadata" />

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="btn primary" onClick={() => practice(v.id)}>
                Practice
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
