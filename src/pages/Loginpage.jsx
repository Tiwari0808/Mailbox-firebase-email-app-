import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { db } from '../store/firebase';
import { useAuth } from '../context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaKey,
  FaSpinner,
  FaSignInAlt,
} from 'react-icons/fa';
import { useToast } from '../store/ToastProvider';

const Loginpage = () => {
  const [isLogin, setisLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();
  const navigate = useNavigate();
  const api_key = import.meta.env.VITE_API_KEY;
  const { login } = useAuth();
  const { showToast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef?.current?.value;

    if (!isLogin && password !== confirmPassword) {
      showToast('Password did not match','error');
      return;
    }

    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`;

    try {
      setIsLoading(true);
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        showToast(data.error.message || 'Authentication Failed','error');
        return;
      }

      const user_id = data.localId;
      const user_email = data.email;
      login(user_id, user_email);

      if (!isLogin) {
        await set(ref(db, `users/${user_id}`), {
          email: user_email,
        });
      }

      navigate('/');
      showToast(isLogin ? 'Login Successful' : 'Signup Successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm space-y-6">
        <h2 className="text-center text-2xl font-semibold text-blue-600 flex items-center justify-center gap-2">
          {isLogin ? <FaSignInAlt /> : <FaUser />}
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              ref={emailInputRef}
              type="email"
              placeholder="Email"
              required
              className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              ref={passwordInputRef}
              type="password"
              placeholder="Password"
              required
              className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <FaKey className="absolute left-3 top-3 text-gray-400" />
              <input
                ref={confirmPasswordInputRef}
                type="password"
                placeholder="Confirm Password"
                required
                className="pl-10 w-full py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" />
                Processing...
              </span>
            ) : isLogin ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setisLogin((prev) => !prev)}
            className="text-blue-600 hover:underline text-sm"
          >
            {isLogin ? 'Don’t have an account? Sign Up' : 'Already registered? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;

