import Image from "next/image";
export default function LogoBoard() {
  return (
    <div className="flex-1 bg-white  p-10 flex flex-col gap-15 items-center ">
      <h2 className="text-4xl font-bold mb-6 text-center">الحارس</h2>

      <div className=" max-w-sm mb-6">
        <Image
          src="/logo.webp"
          alt="Al-Haris Illustration"
          width={300}
          height={300}
          className="w-full h-auto object-contain"
        />
        <p className="text-lg text-center font-semibold  leading-relaxed">
          انضم لألاف العائلات التي تثق بنا لحماية ابنائهم
        </p>
      </div>
    </div>
  );
}
