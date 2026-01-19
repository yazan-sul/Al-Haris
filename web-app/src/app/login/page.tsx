import BottomBar from "../../components/navbar/BottomBar";
import Navbar from "../../components/navbar/Navbar";
import LoginForm from "../../components/forms/login";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <LoginForm />
      </main>
      <BottomBar />
    </div>
  );
}
