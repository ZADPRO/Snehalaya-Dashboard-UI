import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';

import './Login.css';

import carousel1 from '../../assets/login/carousel1.png';
import carousel2 from '../../assets/login/carousel2.png';
import carousel3 from '../../assets/login/carousel3.png';
import logo from '../../assets/logo/icon.png';

const images = [carousel1, carousel2, carousel3];

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      Username: username,
      Password: password,
    };

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/admin/login',
        payload
      );

      const result = response.data;

      if (result?.data?.status && result.data.token) {
       
        const storage = checked ? localStorage : sessionStorage;
        storage.setItem('token', 'Bearer ' + result.data.token);
        storage.setItem('user', JSON.stringify(result.data.user));

        toast.current?.show({
          severity: 'success',
          summary: 'Login Successful',
          detail: 'Welcome to Snehalaya',
          life: 2500,
        });

        setTimeout(() => navigate('/dashboard'), 2500);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Enter details correctly',
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Enter details correctly',
        life: 3000,
      });
    }
  };

  return (
    <div className="login-wrapper flex justify-content-between gap-3 px-5">
      <Toast ref={toast} />

      <Toast ref={toast} />

      <div className="carousel-box flex-3">
        <img src={images[index]} alt="Slide" className="slide-image" />
        <div className="overlay">
          <div className="flex flex-column align-items-center">
            <img src={logo} alt="Logo" className="logo" />
            <p className="mt-2">Snehalaya Silks</p>
          </div>
          <p className="slide-text">Discover timeless fashion, crafted with care.</p>
          
        </div>
      </div>

      <div className="login-form flex-2">
        <div className="text-center flex flex-column gap-2">
          <p className="text-xl font-semibold">Welcome to</p>
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

        <div className="flex justify-content-between align-items-center gap-8  px-3 my-3">
          <div className="flex align-items-left gap-2">
            <Checkbox
              inputId="rememberme"
              checked={checked}
              onChange={(e) => setChecked(e.checked!)}
            />
            <label htmlFor="remember me" className="text-sm">
              Remember Me
            </label>
          </div>

          <Link to="/forgetpass" className="text-blue-600 text-sm hover:underline">
            Reset Your Password?
          </Link>
        </div>
        <Button
          label="Login Now"
          className="login-button uppercase"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Login;
