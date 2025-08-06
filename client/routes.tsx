

import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Login from './components/Login.tsx'
import Home from './components/Home.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Login />} />
    <Route path="Home" element={<Home />} />
  </Route>,
)