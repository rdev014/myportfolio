import { About } from "./Components/About"
import TechStackVibe from "./Components/TechSpreadSection"
// import StackPage from "./Components/TechSpreadSection"
import Hero from "./Pages/Hero"

function App(){
  return(
    <>
   <Hero/>
   {/* <StackPage/> */}
   <About/>
   <TechStackVibe/>
    </>

  )
}
export default App