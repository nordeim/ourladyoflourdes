import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { History } from "@/pages/History";
import { Worship } from "@/pages/Worship";
import { Sacraments } from "@/pages/Sacraments";
import { Ministries } from "@/pages/Ministries";
import { NewsEvents } from "@/pages/NewsEvents";
import { Give } from "@/pages/Give";
import { FAQ } from "@/pages/FAQ";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/history-of-the-church" element={<History />} />
          <Route path="/worship" element={<Worship />} />
          <Route path="/mass-times" element={<Worship />} />
          <Route path="/contact-us" element={<Worship />} />
          <Route path="/sacraments" element={<Sacraments />} />
          <Route path="/all-sacraments" element={<Sacraments />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/all-ministries" element={<Ministries />} />
          <Route path="/news-events" element={<NewsEvents />} />
          <Route path="/news-and-events" element={<NewsEvents />} />
          <Route path="/parish-bulletin" element={<NewsEvents />} />
          <Route path="/church-events" element={<NewsEvents />} />
          <Route path="/give" element={<Give />} />
          <Route path="/donate" element={<Give />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
