import React, { useState, useEffect } from 'react';
import { ShowProducts, SideUtils } from '../../compos';
import Hero from './Hero';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from "react-icons/fa";

const Home = () => {
  const homeStyles = {
    productSection: `flex flex-col sm:flex-row justify-between items-center ss:items-start gap-x-3`,
  } 
    
  return (
    <section className="flex justify-center flex-col">

      {/* <ProjectDocument /> */}
      <Link to="/projectdoc" className="flex justify-center items-center gap-x-1 bg-maincolor border-none text-white p-2 rounded-md text-sm hover:text-[15px]">Click To See Project Documentation <FaExternalLinkAlt/></Link>
      <Hero />

      <div className={`${homeStyles.productSection}`}>
        <SideUtils />
        <ShowProducts />
      </div>
      
    </section>
  )
}

export default Home;
