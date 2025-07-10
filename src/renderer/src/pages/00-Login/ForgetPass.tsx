import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';
import { Toast } from 'primereact/toast';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import axios from 'axios';
import './Login.css';

import carousel1 from '../../assets/login/carousel1.png';
import carousel2 from '../../assets/login/carousel2.png';
import carousel3 from '../../assets/login/carousel3.png';
import logo from '../../assets/logo/icon.png';

const images = [carousel1, carousel2, carousel3];

const ForgotPassword: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);
const [passwordReset, setPasswordReset] = useState(false);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const BASE_URL = import.meta.env.VITE_API_URL;


  const rules = {
  lowercase: /[a-z]/.test(newPassword),
  uppercase: /[A-Z]/.test(newPassword),
  number: /\d/.test(newPassword),
  specialChar: /[@$!%*?&]/.test(newPassword),
  minLength: newPassword.length >= 8,
};

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidOtp = (otp: string) => /^\d{4}$/.test(otp);
  const isStrongPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

 const handleSendOtp = async () => {
  if (!email || !isValidEmail(email)) {
    toast.current?.show({ severity: 'warn', summary: 'Invalid Email', detail: 'Enter a valid email.', life: 2000 });
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/admin/forgot-password`, { email });
    toast.current?.show({ severity: 'success', summary: 'OTP Sent', detail: res.data.message, life: 2000 });
    setStep(2);
    setOtpSent(true); 
  } catch (err: any) {
    setOtpSent(false);
    toast.current?.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || 'Failed to send OTP.', life: 3000 });
  }
};
const handleVerifyOtp = async () => {
  if (!otp || !isValidOtp(otp)) {
    toast.current?.show({ severity: 'warn', summary: 'Invalid OTP', detail: 'Enter a 4-digit numeric OTP.', life: 2000 });
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/admin/verify-otp`, { email, otp });
    toast.current?.show({ severity: 'success', summary: 'OTP Verified', detail: res.data.message, life: 2000 });
    setStep(3);
    setOtpVerified(true);
  } catch (err: any) {
    setOtpVerified(false);
    toast.current?.show({ severity: 'error', summary: 'Verification Failed', detail: err?.response?.data?.message || 'Invalid OTP.', life: 3000 });
  }
};
const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    toast.current?.show({ severity: 'warn', summary: 'Missing Fields', detail: 'Enter both passwords.', life: 2000 });
    return;
  }
  if (!isStrongPassword(newPassword)) {
    toast.current?.show({ severity: 'warn', summary: 'Weak Password', detail: 'Password must meet complexity requirements.', life: 3000 });
    return;
  }
  if (newPassword !== confirmPassword) {
    toast.current?.show({ severity: 'warn', summary: 'Mismatch', detail: 'Passwords do not match.', life: 2000 });
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/admin/reset-password`, { email, newPassword });
    toast.current?.show({ severity: 'success', summary: 'Success', detail: res.data.message || 'Password reset successful.', life: 2000 });
    setPasswordReset(true); 
    setTimeout(() => navigate('/login', { replace: true }), 2000);
  } catch (err: any) {
    toast.current?.show({ severity: 'error', summary: 'Reset Failed', detail: err?.response?.data?.message || 'Could not reset password.', life: 3000 });
  }
};

  return (
    <div className="login-wrapper flex justify-content-between gap-3 px-5">
      <Toast ref={toast} />
      <div className="carousel-box flex-3">
        <img src={images[carouselIndex]} alt="Slide" className="slide-image" />
        <div className="overlay">
          <div className="flex flex-column align-items-center">
            <img src={logo} alt="Logo" className="logo" />
            <p className="mt-2">Snehalaya Silks</p>
          </div>
          <p className="slide-text">Reset your password safely and securely.</p>
        </div>
      </div>

      <div className="login-form flex-2">
        <div className="text-center flex flex-column gap-2">
          <p className="text-xl font-semibold">Forgot Your Password?</p>
          <p className="text-lg text-gray-500">Reset in 3 simple steps.</p>
        </div>

        {step === 1 && (
          <>
            <div className="input-group mt-4">
              <Mail className="icon" />
              <InputText placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button
                    label="Send OTP"
                    className="login-button mt-3 uppercase"
                    onClick={handleSendOtp}
                    disabled={!isValidEmail(email) || otpSent}
                  />

            <Button label="Back to Login" icon={<ArrowLeft size={16} />} className="mt-2" text style={{ color: '#f5f5f5' }} onClick={() => navigate('/login')} />
          </>
        )}

        {step === 2 && (
          <>
            <div className="otp-wrapper mt-4 flex flex-column align-items-center gap-2">
              <InputOtp className="custom-otp-input" value={otp} onChange={(e) => setOtp(typeof e.value === 'string' ? e.value : '')} integerOnly length={4} />
            </div>
            <Button
              label="Verify OTP"
              className="login-button mt-4 uppercase"
              onClick={handleVerifyOtp}
              disabled={!isValidOtp(otp) || otpVerified}
            />

            <Button label="Back to Email" icon={<ArrowLeft size={16} />} className="mt-2" text style={{ color: '#f5f5f5' }} onClick={() => setStep(1)} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="input-group mt-4">
              <Lock className="icon" />
              <Password placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} toggleMask className="w-full"
                feedback footer={(
                  <>
                    <Divider />
                    <ul className="pl-2 ml-2 mt-0 line-height-3 text-sm">
                     <li style={{ color: rules.lowercase ? 'green' : 'gray' }}>
                        {rules.lowercase ? '✔' : '✖'} At least one lowercase
                      </li>
                      <li style={{ color: rules.uppercase ? 'green' : 'gray' }}>
                        {rules.uppercase ? '✔' : '✖'} At least one uppercase
                      </li>
                      <li style={{ color: rules.number ? 'green' : 'gray' }}>
                        {rules.number ? '✔' : '✖'} At least one numeric
                      </li>
                      <li style={{ color: rules.specialChar ? 'green' : 'gray' }}>
                        {rules.specialChar ? '✔' : '✖'} At least one special character
                      </li>
                      <li style={{ color: rules.minLength ? 'green' : 'gray' }}>
                        {rules.minLength ? '✔' : '✖'} Minimum 8 characters
                      </li>
                    </ul>
                  </>
                )}
              />
            </div>
            <div className="input-group mt-3">
              <Lock className="icon" />
              <div className="w-full">
                <Password placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask className="w-full" feedback={false} />
                {confirmPassword.length > 0 && (
                  <div className="text-sm mt-2" style={{ color: newPassword === confirmPassword ? '#22c55e' : '#ef4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {newPassword === confirmPassword ? ' Password match' : 'Password do not match'}
                  </div>
                )}
              </div>
            </div>
           <Button
              label="Reset Password"
              className="login-button mt-4 uppercase"
              onClick={handleResetPassword}
              disabled={passwordReset}
            />

            <Button label="Back to OTP" icon={<ArrowLeft size={16} />} className="mt-2" text style={{ color: '#f5f5f5' }} onClick={() => setStep(2)} />
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
