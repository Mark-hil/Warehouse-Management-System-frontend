import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Warehouse, Mail, Lock, User, Building } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  department: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    department: ''
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const { register, state: { isLoading, error } } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          department: formData.department
        });
        navigate('/dashboard');
      } catch (error) {
        // Error is handled by the auth context
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Warehouse className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Warehouse Management System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              label="Username"
              leftIcon={<User size={18} />}
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              fullWidth
            />

            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              leftIcon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              fullWidth
            />

            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              label="Full Name"
              leftIcon={<User size={18} />}
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              fullWidth
            />

            <Input
              id="department"
              name="department"
              type="text"
              required
              label="Department"
              leftIcon={<Building size={18} />}
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              fullWidth
            />

            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="Password"
              leftIcon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              fullWidth
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              label="Confirm Password"
              leftIcon={<Lock size={18} />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              fullWidth
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
