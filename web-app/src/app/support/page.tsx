import ContactUs from "../../components/main/Support";
import Terms from "../../components/main/Terms";
import BottomBar from "../../components/navbar/BottomBar";
import Navbar from "../../components/navbar/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <ContactUs />
      </main>
      <BottomBar />
    </div>
  );
}
