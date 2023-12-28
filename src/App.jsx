import React from 'react'
import './app.css';
import Musicelement from './component/Musicelement';
import {motion} from 'framer-motion' 
const App = () => {
  return (
    <motion.div className="player" drag dragConstraints={{ left: -450, right: 360, top: -150, bottom: 180 }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 100 }} whileDrag={{scale : 1.1}}>
      <h3>Music World</h3>
      <hr />

    <Musicelement/>
    </motion.div>
  )
}

export default App