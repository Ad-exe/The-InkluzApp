import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar";
import SOSButton from "./components/SOSButton";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import SignToText from "./pages/SignToText";
import TextToSpeech from "./pages/TextToSpeech";
import Contact from "./pages/Contact";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  // more reliable than innerWidth-only
  const mq = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia("(max-width: 768px)");
  }, []);

  useEffect(() => {
    const update = () => setIsMobile(mq ? mq.matches : window.innerWidth <= 768);

    update();

    if (mq) {
      mq.addEventListener?.("change", update);
      return () => mq.removeEventListener?.("change", update);
    } else {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  }, [mq]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/sign-to-text" element={<SignToText />} />
        <Route path="/text-to-speech" element={<TextToSpeech />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* SOS: render only on mobile */}
      {isMobile && <SOSButton />}
    </BrowserRouter>
  );
}
