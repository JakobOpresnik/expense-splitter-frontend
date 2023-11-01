import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/registerComponent';
import Login from './components/loginComponent';
import Home from './components/homeComponent';
import Profile from './components/profileComponent';
import Header from './components/headerComponent';
import Footer from './components/footerComponent';
import Groups from './components/groupsComponent';
import GroupEntry from './components/groupEntryComponent';
import Group from './components/groupComponent';
import PurchaseEntry from './components/purchaseEntryComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/groups" element={<Groups/>} />
        <Route path="/groups/entry" element={<GroupEntry/>} />
        <Route path="/groups/:id" element={<Group/>} />
        <Route path="/groups/:id/purchases/entry" element={<PurchaseEntry/>} />
        <Route element={<Header/>} />
        <Route element={<Footer/>} />
      </Routes>
    </Router>
  );
}

export default App;
