//import { useState } from "react";
//import { motion } from "framer-motion";
//import { Send, Settings, HelpCircle, Clock, LayoutDashboard } from "lucide-react";
//
//export default function App() {
//  const [question, setQuestion] = useState("");
//  const [answer, setAnswer] = useState("");
//
//  const handleSend = async () => {
//    setAnswer("Exponential Backoff Fetch Utility activated. Waiting for response...");
//    
//    // Example of exponential backoff fetch simulation
//    let attempt = 0;
//    const fetchWithBackoff = async () => {
//      try {
//        attempt++;
//        // Simulate a fetch delay
//        await new Promise((res) => setTimeout(res, 1000 * attempt));
//        setAnswer("Response received successfully after " + attempt + " attempts!");
//      } catch {
//        if (attempt < 5) {
//          await fetchWithBackoff();
//        } else {
//          setAnswer("Failed to fetch after multiple attempts.");
//        }
//      }
//    };
//    fetchWithBackoff();
//  };
//
//  return (
//    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans overflow-hidden">
//      {/* Sidebar */}
//      <div className="w-20 h-[90vh] rounded-3xl bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-around shadow-lg backdrop-blur-lg p-4">
//        <SidebarIcon icon={<LayoutDashboard />} label="Dashboard" />
//        <SidebarIcon icon={<Clock />} label="History" />
//        <SidebarIcon icon={<Settings />} label="Settings" />
//        <SidebarIcon icon={<HelpCircle />} label="Help" />
//      </div>
//
//      {/* Main content */}
//      <div className="flex flex-col md:flex-row items-center justify-around w-[80%] ml-10 gap-10">
//        {/* Question Box */}
//        <motion.div
//          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-[350px] text-center shadow-xl"
//          initial={{ opacity: 0, y: -20 }}
//          animate={{ opacity: 1, y: 0 }}
//        >
//          <h1 className="text-2xl font-semibold mb-4">Ask a Question</h1>
//          <input
//            type="text"
//            value={question}
//            onChange={(e) => setQuestion(e.target.value)}
//            placeholder="Type your question here..."
//            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
//          />
//          <motion.button
//            whileHover={{ scale: 1.05 }}
//            whileTap={{ scale: 0.9 }}
//            onClick={handleSend}
//            className="w-full py-3 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-lg hover:shadow-pink-400/50 transition-all"
//          >
//            Send! <Send className="inline ml-2 w-5 h-5" />
//          </motion.button>
//        </motion.div>
//
//        {/* Answer Box */}
//        <motion.div
//          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-[400px] shadow-lg"
//          initial={{ opacity: 0, y: 20 }}
//          animate={{ opacity: 1, y: 0 }}
//        >
//          <div className="rounded-2xl overflow-hidden mb-4">
//            <img
//              src="https://images.unsplash.com/photo-1604079628040-94301bb21b92?auto=format&fit=crop&w=800&q=60"
//              alt="AI Visualization"
//              className="object-cover w-full h-32"
//            />
//          </div>
//          <h2 className="text-lg font-semibold mb-2">Answer:</h2>
//          <p className="text-gray-200">{answer || "Waiting for your question..."}</p>
//        </motion.div>
//      </div>
//    </div>
//  );
//}
//
//function SidebarIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
//  return (
//    <motion.div
//      whileHover={{ scale: 1.2 }}
//      className="flex flex-col items-center text-white cursor-pointer"
//    >
//      <div className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all">{icon}</div>
//      <span className="text-xs mt-2">{label}</span>
//    </motion.div>
//  );
//}
//