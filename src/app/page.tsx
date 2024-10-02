import PetalCanvas from "./components/sakura";
import Footer from "./components/footer";
import Image from "next/image";
import MusicPlayer from "./components/music";
export default function Home() {
  return (
    <section className="relative min-h-screen w-screen flex flex-col items-center justify-center py-[4vh] px-3">
      <Image
        src="/5cpc.jpg" // Replace with your image path
        alt="Description of image"
        width={1500}
        height={1}
        className="absolute w-full h-full object-cover object-bottom -z-[2] brightness-50"
      />
      <PetalCanvas
        speed={0.6}
        totalPetals={20}
        className="absolute -z-[1] brightness-95"
      />
      <MusicPlayer />
      <Footer />
    </section>
  );
}
