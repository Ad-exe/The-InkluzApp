import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 14px",
  borderRadius: 12,
  fontWeight: 800,
  color: isActive ? "#07201b" : "var(--text)",
  background: isActive ? "var(--brand)" : "transparent",
  textDecoration: "none",
  transition: "all 0.2s ease",
});

export default function Navbar() {
  return (
    <div
      style={{
        position: "sticky",        // ✅ keeps navbar on top
        top: 0,
        zIndex: 1000,              // ✅ higher than images
        background: "#0b1119",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontWeight: 950,
              letterSpacing: 1,
              color: "var(--text)",
            }}
          >
            INKLUZ{" "}
            <span style={{ color: "var(--muted)", fontWeight: 800 }}>
              APP
            </span>
          </div>

          {/* Links */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginLeft: "auto",
              flexWrap: "wrap",
            }}
          >
            <NavLink to="/" style={linkStyle}>
              Home
            </NavLink>

            <NavLink to="/learn" style={linkStyle}>
              Videos
            </NavLink>

            <NavLink to="/sign-to-text" style={linkStyle}>
              Sign → Text
            </NavLink>

            <NavLink to="/text-to-speech" style={linkStyle}>
              Text → Speech
            </NavLink>

            <NavLink to="/contact" style={linkStyle}>
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
