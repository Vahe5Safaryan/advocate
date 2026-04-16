import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Statistics from "@/components/Statistics";
import Team from "@/components/Team";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Statistics />
      <Team />
      <Blog />
      <Contact />
    </>
  );
}
