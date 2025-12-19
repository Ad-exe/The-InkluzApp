import { useEffect, useMemo, useState } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("Hello! Welcome to INKLUZ.");
  const [voices, setVoices] = useState([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const selectedVoice = useMemo(
    () => voices.find((v) => v.voiceURI === voiceURI),
    [voices, voiceURI]
  );

  useEffect(() => {
    const load = () => {
      const list = window.speechSynthesis?.getVoices?.() || [];
      setVoices(list);
      if (!voiceURI && list.length) {
        const prefer = list.find((v) => v.lang?.toLowerCase().includes("en-in"));
        setVoiceURI((prefer || list[0]).voiceURI);
      }
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text || "");
    const v = voices.find((x) => x.voiceURI === voiceURI);
    if (v) u.voice = v;

    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;

    window.speechSynthesis.speak(u);
  };

  const stop = () => window.speechSynthesis?.cancel?.();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="page ttsPage">
      <div className="toolHeader">
        <h1 className="toolTitle">Text → Speech</h1>
        <p className="toolSub">Type text, choose a voice, then press Speak.</p>
      </div>

      <div className="ttsGrid">
        <div className="card ttsLeft">
          <label className="label">Text</label>
          <textarea
            className="ttsTextarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
          />

          <div className="btnRow">
            <button className="btn" onClick={speak}>Speak</button>
            <button className="btn" onClick={stop}>Stop</button>
            <button className="btn" onClick={copy}>Copy</button>
            <button className="btn" onClick={() => setText("")}>Clear</button>
          </div>

          <p className="tip">
            Tip: Later we can connect Sign → Text output to this page.
          </p>
        </div>

        <div className="card ttsRight">
          <div className="row">
            <label className="label">Voice</label>
            <select
              className="select"
              value={voiceURI}
              onChange={(e) => setVoiceURI(e.target.value)}
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="sliderRow">
            <span>Rate</span>
            <input type="range" min="0.5" max="2" step="0.1" value={rate}
              onChange={(e) => setRate(Number(e.target.value))} />
            <b>{rate.toFixed(1)}</b>
          </div>

          <div className="sliderRow">
            <span>Pitch</span>
            <input type="range" min="0" max="2" step="0.1" value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))} />
            <b>{pitch.toFixed(1)}</b>
          </div>

          <div className="sliderRow">
            <span>Volume</span>
            <input type="range" min="0" max="1" step="0.1" value={volume}
              onChange={(e) => setVolume(Number(e.target.value))} />
            <b>{volume.toFixed(1)}</b>
          </div>

          <div className="mutedLine">
            Selected: <b>{selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : "-"}</b>
          </div>

          <div className="quick">
            <div className="label">Quick Phrases</div>
            <div className="chipRow">
              {["Hello", "Wait", "Help", "Thanks"].map((p) => (
                <button key={p} className="chip" onClick={() => setText(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
