import { useState } from "react";

const icons = {
  dashboard: (color) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  products: (color) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill={color} stroke="none" />
    </svg>
  ),
  operations: (color) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  history: (color) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  settings: (color) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
};

const navItems = [
  { key: "dashboard", label: "Dashboard", highlighted: false },
  { key: "products", label: "Products", highlighted: true, tooltip: "Hiyanshu Gupta" },
  { key: "operations", label: "Operations", highlighted: true },
  { key: "history", label: "Move History", highlighted: false },
  { key: "settings", label: "Settings", highlighted: false },
];

export default function Dashboard() {
  const [active, setActive] = useState("operations");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f0f0",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          border: "1.5px solid #f4a0a0",
          borderRadius: "6px",
          display: "flex",
          width: "960px",
          height: "520px",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "210px",
            minWidth: "210px",
            background: "#0f1b2d",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Profile */}
          <div
            style={{
              padding: "20px 18px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#cdd5e0",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ color: "#fff", fontSize: "13.5px", fontWeight: 500, lineHeight: 1.3 }}>
                Hiyanshu Gupta
              </div>
              <div style={{ color: "#4a9eff", fontSize: "11.5px", cursor: "pointer" }}>
                Edit Profile
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "4px 0" }}>
            {navItems.map((item) => {
              const isActive = active === item.key;
              const color = item.highlighted ? "#fff" : "#b0bec5";

              return (
                <div
                  key={item.key}
                  style={{ position: "relative" }}
                  onClick={() => setActive(item.key)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: item.highlighted ? "9px 14px" : "10px 18px",
                      margin: item.highlighted ? "2px 4px" : "0",
                      color,
                      cursor: "pointer",
                      fontSize: "13.5px",
                      border: item.highlighted ? "1.5px solid #e05c2a" : "none",
                      borderRadius: item.highlighted ? "3px" : "0",
                      background: isActive && !item.highlighted
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                    }}
                  >
                    {icons[item.key](color)}
                    <span>{item.label}</span>
                  </div>

                  {/* Tooltip */}
                  {item.tooltip && (
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "44px",
                        background: "#e05c2a",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: "3px",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        pointerEvents: "none",
                      }}
                    >
                      {item.tooltip}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, background: "#fff", position: "relative", padding: "16px 20px" }}>
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-20%)",
              width: "420px",
              height: "40px",
              background: "#d4d4d4",
              borderRadius: "3px",
            }}
          />
        </div>
      </div>
    </div>
  );
}