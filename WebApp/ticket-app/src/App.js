import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './layout/Footer';
import Header from './layout/Header';
import { createContext, useReducer } from 'react';
import myReducer from './reducers/UserReducer';
import Home from './components/Home';
import Tour from './components/Tour';
import TourDetail from './components/TourDetail';
import Login from './components/Login';
import Register from './components/Register';
import cookies from 'react-cookies'

export const UserContext = createContext()

function App() {
  const [user, dispatch] = useReducer(myReducer, cookies.load('current_user'))
  return (
    <BrowserRouter>
    <UserContext.Provider value={[user, dispatch]}>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/routes/:routeId/tours" element={<Tour/>}/>
        <Route path="/tours/:tourId" element={<TourDetail/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
      </Routes>
      <Footer/>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
