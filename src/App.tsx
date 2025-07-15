// import React from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
// import BackgroundParticles from "./components/BackgroundParticles";
import { useEffect, useRef } from "react";


import { useLocation } from 'react-router-dom';

import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme";
import Chatbot from "./components/Chatbot";
import SkillTracker from "./components/skilllsTrackerTrigger";
import { Provider, useDispatch } from "react-redux";
import { syncWithExistingSkills } from "./redux/skillsSlice";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import {  GoogleAuthWrapper } from "./context/GoogleAuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from "./components/Navbar";
import { GitHubGlobe } from "./components/GitHubGlobe";

function InnerApp() {
  const location = useLocation();

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box sx={{ mx: 'auto', px: 5 }}>
        <Routes>
          <Route path="/" element={<>
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Footer />
            <Chatbot />
          </>} />
          <Route path="/skills" element={<>
            <Skills />
            <Footer />
          </>} />
          <Route path="/github" element={<>
            <GitHubGlobe />
            <Footer />
          </>} />
        </Routes>

        {/* ✅ Conditionally render SkillTracker */}
        {location.pathname !== '/github' && <SkillTracker />}
      </Box>
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncWithExistingSkills());
  }, [dispatch]);

  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;

      if (bgRef.current) {
        const chars = bgRef.current.querySelectorAll(".float-char");
        chars.forEach((char: any, i) => {
          const depth = (i % 5) + 1;
          char.style.transform += ` translate(${offsetX * depth}px, ${offsetY * depth}px)`;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

 const chars = [
  "$", "₿", "</>", "{}", "()", "λ", "π", "#", "@", "∞", "∑", "Δ",
  "⟶", "←", "→", "⚡", "🔒", "🧠", "🤖", "💻", "📊", "🌐", "🪙", "⌨️",
  "∂", "~", "`", "ƒ", "μ", "∇", "⊕", "¬", "⩾", "===", "!==", "&&", "||"
];

  const colors = ["#00ffff", "#00ff00", "#ff00ff", "#ffff00", "#ffffff"];


  const floatingSpans = Array.from({ length: 30 }).map((_, i) => {
    const style: React.CSSProperties = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${14 + Math.random() * 16}px`,
      color: colors[i % colors.length],
      animationDuration: `${10 + Math.random() * 10}s`,
    };

    return (
      <span key={i} className="float-char" style={style} ref={bgRef}>
        {chars[i % chars.length]}
      </span>
    );
  });

  return (
    <GoogleAuthWrapper>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
             <div className="floating-container">
            {floatingSpans}
          </div>
            <Router>
              <InnerApp />
            </Router>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </GoogleAuthWrapper>
  );
}


export default App;
