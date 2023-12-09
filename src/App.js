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
import { useEffect, useState, createContext } from 'react';

export const UserContext = createContext();

function App() {

  const [currentUser, setCurrentUser] = useState(null);
  //const [currentUserName, setCurrentUserName] = useState();

  useEffect(() => {
      async function getCurrentUser() {
          try {
              const response = await fetch("http://localhost:9000/users/current");
              if (response.ok) {
                const data = await response.json();
                setCurrentUser(data);
              }
              //setCurrentUserName(data.username);
          }
          catch(error) {
              console.error(`call to API failed: ${error}`);
          }
      }

      getCurrentUser();
  }, []); // ensure this API endpoint is only called once

  return (
    <UserContext.Provider value={{
      currentUser: currentUser,
      setCurrentUser: setCurrentUser
    }}>
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
    </UserContext.Provider>
  );
}

export default App;
