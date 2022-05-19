import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

import StartComponent from './start/start.component';
import SessionComponent from './session/photo.component';
import ThanksComponent from './thanks/thanks.component';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<StartComponent/>}></Route>
          <Route path='/session' element={<SessionComponent/>}></Route>
          <Route path='/thanks' element={<ThanksComponent/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;