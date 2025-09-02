

import { createRoutesFromElements, Route } from 'react-router-dom'
import App from './components/App.tsx'
import Login from './components/Login.tsx'
import Home from './components/Home.tsx'
import AuthTest from './components/AuthTest.tsx'
import ProfileSettings from './components/ProfileSettings.tsx'
import BankDetails from './components/BankDetails.tsx'
import PaymentTest from './components/PaymentTest.tsx'

export default createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Login />} />
    <Route path="Home" element={<Home />} />
    <Route path="auth-test" element={<AuthTest />} />
    <Route path="profile" element={<ProfileSettings />} />
    <Route path="bank-details" element={<BankDetails paymentType="rent" amount={1200} dueDate="2024-01-15" onClose={() => {}} />} />
    <Route path="payment-test" element={<PaymentTest />} />
  </Route>,
)