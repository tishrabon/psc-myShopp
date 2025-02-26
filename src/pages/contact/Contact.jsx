import React from 'react';

// https://i.ibb.co/SNLZFh4/buttonphone-3.jpg
// img/objects fitting trials yall!

const Contact = () => {
  const imgFile = "https://i.ibb.co/SNLZFh4/buttonphone-3.jpg"

  return (
    <section className="w-[300px] h-[200px] bg-red-100 flex flex-col justify-between items-center rounded-md p-2">
      {/* <span>kire?</span>  */}
      
      <div className="aspect-square bg-white flex flex-col justify-center items-center overflow-hidden">
        <img className="object-cover w-full h-full bg-green-100" src={imgFile} alt=""/>
      </div>

    </section>
  )
}

export default Contact;