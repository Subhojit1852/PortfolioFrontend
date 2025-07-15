import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // use slim version

export default function BackgroundParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // fixes checkVersion error
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{ position: "absolute", zIndex: 0 }}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        detectRetina: true,
        particles: {
         number: { value: window.innerWidth < 768 ? 30 : 15 },
    size: { value: window.innerWidth < 768 ? 14 : 10 },
          move: { enable: true, speed: 1.2 },
          opacity: { value: 0.4 },
          color: {
            value: ["#00ffff", "#00ff00", "#ff00ff", "#ffff00", "#ffffff"]
          },
          shape: {
            type: "char",
            character: [
              { value: "$", font: "Verdana" },
              { value: "BTC" },
              { value: "</>" },
              { value: "{ }" },
              { value: "λ" }
            ]
          }
        }
      }}
    />
  );
}
