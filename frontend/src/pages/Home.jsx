import "./Home.css";

const sections = [
  {
    image: "/home/img1.jpg",
    title: "Learning Through Sign Language",
    text: "INKLUZ helps people communicate naturally using sign language.",
  },
  {
    image: "/home/img2.jpg",
    title: "Inclusive Education",
    text: "Helping children learn and express themselves visually.",
  },
  {
    image: "/home/img3.jpg",
    title: "Breaking Communication Barriers",
    text: "Bridging the gap between sign language users and the hearing world.",
  },
  {
    image: "/home/img4.jpg",
    title: "Assistive Hearing Support",
    text: "Accessible tools that support hearing-impaired and elderly users.",
  },
  {
    image: "/home/img5.jpg",
    title: "Freedom of Expression",
    text: "Everyone deserves the right to communicate freely and safely.",
  },
  {
    image: "/home/img6.jpg",
    title: "Accessibility for All",
    text: "INKLUZ is built with inclusion and accessibility at its core.",
  },
];

export default function Home() {
  return (
    <div className="home">
      {sections.map((sec, i) => (
        <section
          key={i}
          className="hero-section"
          style={{ backgroundImage: `url(${sec.image})` }}
        >
          <div className="overlay">
            <div className="hero-content">
              <h1>{sec.title}</h1>
              <p>{sec.text}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
