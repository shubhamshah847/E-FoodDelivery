import React from 'react'
import Nav from '../components/nav'
import { FiMessageCircle, FiX } from "react-icons/fi";
import YumzoChatbot from '../components/chatBot';
import FoodItems from '../components/FoodItems';
import { useSelector } from 'react-redux';

function Home({ isOpen, onClick }) {
  const {userData} = useSelector(state=>state.user)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. Fixed Navbar */}
      <Nav/>

      {/* 2. Main Content Area (padding-top offsets fixed navbar height) */}
      <main className="flex-1 pt-16 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
       
        {/* 3. Food Items Grid/List Section */}
        
      </main>

      {/* 4. Chatbot Widget (Positioned Floating at Bottom-Right) */}
      <aside className="fixed bottom-6 right-6 z-50">
        <YumzoChatbot />
      </aside>
    </div>
  );
};

export default Home