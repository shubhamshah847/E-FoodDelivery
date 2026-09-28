import React from 'react'
import Nav from '../components/nav'
import { FiMessageCircle, FiX } from "react-icons/fi";
import YumzoChatbot from '../components/chatBot';

function Home({ isOpen, onClick }) {
  return (
    <>   
     <Nav />
      <YumzoChatbot/>
      
    </>
  );
}

export default Home