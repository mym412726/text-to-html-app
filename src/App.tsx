import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import TextToHtml from "@/pages/TextToHtml";
import UIDesigner from "@/pages/UIDesigner";
import GeneratedPages from "@/pages/GeneratedPages";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/text-to-html" element={<TextToHtml />} />
            <Route path="/ui-designer" element={<UIDesigner />} />
            <Route path="/generated-pages" element={<GeneratedPages />} />
            <Route path="/other" element={<div className="text-center text-xl py-20">Other Page - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
