
import About from "./Components/About"
import { Contact } from "./Components/Contact"
import ProjectsSection from "./Components/Projects"
import TechStackVibe from "./Components/TechSpreadSection"
// import StackPage from "./Components/TechSpreadSection"
import Hero from "./Pages/Hero"

function App(){
  return(
    <>
   <Hero/>
   <About/>
   <TechStackVibe/>
   <ProjectsSection/>
   <Contact/>
    </>

  )
}
export default App