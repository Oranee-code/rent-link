import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'


function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Home') 
    }
  }, [isAuthenticated, navigate])

  return (
    <div>
      <h1>Rent Link</h1>
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  )
}

export default Login