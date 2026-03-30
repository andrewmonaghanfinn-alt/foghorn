import "./App.css";
import ServiceDashboard from "./assets/ServiceDashboard";

function App() {
  return (
    <>
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source
          src="src\media\vecteezy_billowing-ground-fog-swirls-and-flows-loop_12824799.mp4"
          type="video/mp4"
        />
      </video>

      <ServiceDashboard />
    </>
  );
}

export default App;
