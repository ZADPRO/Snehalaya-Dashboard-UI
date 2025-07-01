import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { User, Lock } from 'lucide-react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

import carousel1 from '../../assets/login/carousel1.png'
import carousel2 from '../../assets/login/carousel2.png'
import carousel3 from '../../assets/login/carousel3.png'
import logo from '../../assets/logo/icon.png'

const images = [carousel1, carousel2, carousel3]

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      Username: username,
      Password: password
    }
    console.log('payload', payload)

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/admin/login',
        {
          Username: username,
          Password: password
        }
        // {
        //   headers: {
        //     'Content-Type': 'application/json'
        //   }
        // }
      )

      const result = response.data
      console.log('API Response:', result)

      if (result?.data?.status && result.data.token) {
        sessionStorage.setItem('token', 'Bearer ' + result.data.token)
        sessionStorage.setItem('user', JSON.stringify(result.data.user))
        navigate('/dashboard')
      } else {
        alert('Login failed: ' + (result.data?.message || 'Invalid credentials'))
      }
    } catch (error: any) {
      console.error('Login error:', error)
      alert(error?.response?.data?.message || 'Something went wrong.')
    }
  }

  return (
    <div className="login-wrapper flex justify-content-between gap-3 px-5">
      <div className="carousel-box flex-3">
        <img src={images[index]} alt="Slide" className="slide-image" />
        <div className="overlay">
          <div className="flex flex-column align-items-center">
            <img src={logo} alt="Logo" className="logo" />
            <p className="mt-2">Snehalaya Silks</p>
          </div>
          <div>
            <p className="slide-text">Discover timeless fashion, crafted with care.</p>
            {/* <div className="indicator">
            {images.map((_, i) => (
              <span key={i} className={i === index ? 'dot active' : 'dot'}></span>
              ))}
              </div> */}
          </div>
        </div>
      </div>

      <div className="login-form flex-2">
        <div className="text-center flex flex-column gap-2">
          <p className="text-xl font-semibold">Welcome to </p>
          <p className="text-5xl uppercase font-bold">Snehalayaa</p>
        </div>
        <p className="mt-5 mb-3 text-xl uppercase font-semibold">Admin Login</p>
        <div className="input-group">
          <User className="icon" />
          <InputText
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock className="icon" />
          <Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
          />
        </div>

        <Button label="Login Now" className="login-button uppercase" onClick={handleSubmit} />
      </div>
    </div>
  )
}

export default Login
