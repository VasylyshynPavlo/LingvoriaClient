import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainTable from './components/MainTable';
import Login from './components/Login';
import RedirectToLoginOrRegister from './components/RedirectToLoginOrRegister';
import Account from './components/Account';
import Register from './components/Register';
import DefaultErrorPage from './components/Errors/DefaultErrorPage';
import CheckApi from './components/CheckApi';
import AppLayout from './components/AppLayout';
import NotFoundPage from './components/Errors/NotFoundPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/error" element={<DefaultErrorPage />} />

        <Route path="/login" element={<><CheckApi /><Login /></>} />
        <Route path="/register" element={<><CheckApi /><Register /></>} />

        <Route path="*" element={
          <>
            <RedirectToLoginOrRegister />
            <AppLayout>
              <Routes>
                <Route path="/" element={<><CheckApi /><MainTable /></>} />
                <Route path="/tests" element={<><CheckApi /><h1>Work in progress</h1></>} />
                <Route path="/account" element={<><CheckApi /><Account /></>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          </>
        } />
        
      </Routes>
      
    </Router>
  );
};

export default App;
