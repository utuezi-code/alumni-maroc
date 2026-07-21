import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import Mission from "@/components/Mission";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#inscription">
        Aller au formulaire d&apos;inscription
      </a>

      <Nav />

      <main>
        <Hero />
        <Carousel />
        <Mission />
        <RegistrationForm />
      </main>

      <Footer />
    </>
  );
}
