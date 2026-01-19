import BottomBar from "@/components/navbar/BottomBar";
import Navbar from "@/components/navbar/Navbar";
import SignupForm from "@/components/forms/signup";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <SignupForm />
      </main>
      <BottomBar />
    </div>
  );
}
