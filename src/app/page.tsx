// src/app/page.tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import { About, Education, Skills, Awards, Experience, Contact, Footer } from '@/components/Sections'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Projects />
        <Skills />
        <Awards />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
