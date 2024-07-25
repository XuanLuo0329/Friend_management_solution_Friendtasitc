import { Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "./PageLayout";
import "./index.css";
import CreateProfile from "./CreateProfile";
import ShowAllFriends from "./ShowAllFriends";
import EventRecommendation from './EventRecommendation';
import Faq from './Faq';
import About from './About';
import Home from "./Home"
import Login from './Components/Login';
import Signup from './Components/Signup';
import GiftRecommendation from "./GiftRecommendation";
import GiftList from "./Components/GiftComponents/GiftList";
import MemoryList from "./Components/MemoryComponent/MemoryList";
import CreateMemory from "./Components/MemoryComponent/CreateMemory";
import MemoryDetails from "./Components/MemoryComponent/MemoryDetails";
import EditMemory from "./Components/MemoryComponent/EditMemory";
import EventRecommendationResult from "./Components/EventRecommendationResult";
import ErrorPage from "./ErrorPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/about" element={<About />} />
          <Route path="/createProfile/:id?" element={<CreateProfile />} />
          <Route path="/ShowAllFriends" element={<ShowAllFriends />} />
          <Route path="/EventRecommendation" element={<EventRecommendation />} />
          <Route path="/giftRecommendation" element={<GiftRecommendation />} />
          <Route path="/giftList" element={<GiftList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/showAllMemories" element={<MemoryList />} />
          <Route path="/create-memory" element={<CreateMemory />} />
          <Route path="/memories/:id" element={<MemoryDetails />} />
          <Route path="/update-memory/:id" element={<EditMemory />} />
          <Route path="/EventRecommendationResult" element={<EventRecommendationResult />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
  );
}

export default App;
