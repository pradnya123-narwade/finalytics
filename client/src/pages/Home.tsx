import MobileApp from "@/components/MobileApp";
import WebCommandCenter from "@/components/WebCommandCenter";

export default function Home() {
  return (
    <div className="split-screen-container">
      {/* 1/4th Screen Mobile App on the Left */}
      <MobileApp />

      {/* 3/4th Screen Web App Workstation on the Right */}
      <WebCommandCenter />
    </div>
  );
}
