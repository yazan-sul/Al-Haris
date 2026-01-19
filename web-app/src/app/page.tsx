import BottomBar from "../components/navbar/BottomBar";
import Navbar from "../components/navbar/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold">مرحباً بك في الحارس</h1>
      </main>
      <BottomBar />
    </div>
  );
}
