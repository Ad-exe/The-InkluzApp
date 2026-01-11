import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SOSButton from "./components/SOSButton";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import SignToText from "./pages/SignToText";
import TextToSpeech from "./pages/TextToSpeech";
import Contact from "./pages/Contact";

export default function App() {
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

      {/* Render always, hide on desktop using CSS */}
      <SOSButton />
    </BrowserRouter>
  );
}
