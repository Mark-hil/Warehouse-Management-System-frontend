import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Form, Input, Button } from '../../components/forms';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name: string) => (value: string) => {
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Form
          title="Sign in to your account"
          description="Enter your credentials to access the warehouse management system"
          onSubmit={handleSubmit}
          error={error || undefined}
          submitLabel="Sign in"
          isSubmitting={isSubmitting}
        >
          <Input
            label="Username"
            name="username"
            type="text"
            required
            icon={<User size={20} />}
            value={credentials.username}
            onChange={e => handleChange('username')(e.target.value)}
            placeholder="Enter your username"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            icon={<Lock size={20} />}
            value={credentials.password}
            onChange={e => handleChange('password')(e.target.value)}
            placeholder="Enter your password"
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            fullWidth
          >
            Sign in
          </Button>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Demo credentials
              </span>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-700">Username: <span className="font-mono">admin</span></p>
            <p className="text-sm text-gray-700">Password: <span className="font-mono">password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;