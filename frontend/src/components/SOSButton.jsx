import { useEffect, useMemo, useState } from "react";

const EMERGENCY_LIST = [
  { label: "112", desc: "All-in-one Emergency", tel: "112" },
  { label: "108", desc: "Ambulance / Medical", tel: "108" },
  { label: "100", desc: "Police", tel: "100" },
  { label: "101", desc: "Fire", tel: "101" },
];

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const callNumber = (tel) => {
    window.location.href = `tel:${tel}`;
  };

  const copyNumber = async (tel) => {
    try {
      await navigator.clipboard.writeText(tel);
    } catch {
      // ignore (clipboard might be blocked)
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="sos-fab" onClick={() => setOpen(true)} aria-label="SOS">
        SOS
      </button>

      {/* Modal */}
      {open && (
        <div className="sos-backdrop" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="sos-card" onClick={(e) => e.stopPropagation()}>
            <div className="sos-head">
              <div>
                <div className="sos-title">Emergency SOS</div>
                <div className="sos-sub">Tap to call or copy a number</div>
              </div>
              <button className="sos-close" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="sos-list">
              {EMERGENCY_LIST.map((x) => (
                <div className="sos-row" key={x.tel}>
                  <div className="sos-left">
                    <div className="sos-num">{x.label}</div>
                    <div className="sos-desc">{x.desc}</div>
                  </div>
                  <div className="sos-actions">
                    <button className="sos-btn" onClick={() => callNumber(x.tel)}>
                      Call
                    </button>
                    <button className="sos-btn ghost" onClick={() => copyNumber(x.tel)}>
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sos-foot">
              {isMobile ? (
                <span>On mobile, “Call” will open the dialer.</span>
              ) : (
                <span>Desktop may not place calls. Test on mobile for best results.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
