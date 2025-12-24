'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor', // Default role
    bloodType: '',
    weight: '', // Added weight
    age: '', // Added age
    facilityName: '', // For Hospital/Lab
    licenseNumber: '', // For Hospital/Lab
    licenseNumber: '', // For Hospital/Lab
    address: '', // Common
    phone: '', // Common
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameTrim = formData.name.trim();
    if (!nameTrim) {
      newErrors.name = 'Full name is required';
    } else if (nameTrim.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (!/^[A-Z]/.test(nameTrim)) {
      newErrors.name = 'Name must start with a capital letter';
    } else if (nameTrim.split(/\s+/).filter(word => word.length > 0).length < 2) {
      newErrors.name = 'Please provide your full name (First and Last name)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'donor') {
      if (!formData.bloodType) {
        newErrors.bloodType = 'Please select your blood type';
      }
      if (!formData.weight || isNaN(formData.weight) || Number(formData.weight) < 45) {
         newErrors.weight = 'Weight must be at least 45kg';
      }
      if (!formData.age || isNaN(formData.age) || Number(formData.age) < 18) {
         newErrors.age = 'You must be at least 18 years old';
      }
    } else {
      // Validation for Hospital/Lab
      if (!formData.facilityName?.trim()) newErrors.facilityName = 'Facility Name is required';
      if (!formData.licenseNumber?.trim()) newErrors.licenseNumber = 'License Number is required';
      if (!formData.address?.trim()) newErrors.address = 'Address is required';
      if (!formData.phone?.trim()) newErrors.phone = 'Phone Number is required';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare payload based on role
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        address: { // Formatting address for the model
          street: formData.address,
          // Defaulting other address fields for now as simple string was requested but model has structure
          // If model expects object, we adapt. If model expects string, we adapt. 
          // Let's assume model has address as object based on User.js viewing.
          // Wait, User.js showed address: { street: String, city: String... }
          // The UI prompt asked for "Address" generically. I'll put it in 'street' for simplicity or modify logic.
          // Actually, let's just send what we have and let the API handle or just put it in street.
          street: formData.address
        },
        phone: formData.phone
      };

      if (formData.role === 'donor') {
        payload.bloodType = formData.bloodType;
        payload.weight = formData.weight;
        payload.age = formData.age;
      } else {
        payload.facilityName = formData.facilityName;
        payload.licenseNumber = formData.licenseNumber;
        // User model address structure: { street, city, state, zip }
      }

      await axios.post('/api/register', payload);

      // Redirect to login after successful registration
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.response?.data?.error || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden my-10">
        <div className="bg-red-600 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            <i className="fas fa-tint mr-2"></i> LifeSaver
          </h1>
          <p className="text-red-100 mt-2">Create your account to join our mission</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6">
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-sm">
              {errors.submit}
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
              I am a...
            </label>
            <div className="flex gap-4">
              {['donor', 'hospital', 'blood-bank'].map((r) => (
                <label key={r} className={`flex-1 text-center py-2 rounded-lg border cursor-pointer capitalize transition-colors ${formData.role === r ? 'bg-red-50 border-red-500 text-red-700 font-bold' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={formData.role === r}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {r === 'blood-bank' ? 'Blood Bank' : r}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              {formData.role === 'donor' ? 'Full Name' : 'Contact Person Name'}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
              placeholder={formData.role === 'donor' ? "Enter your full name" : "Enter contact person name"}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {formData.role === 'donor' && (
            <>
            <div className="mb-5">
              <label htmlFor="bloodType" className="block text-gray-700 font-medium mb-2">
                Blood Type
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 appearance-none ${errors.bloodType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
              >
                <option value="">Select your blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
            </div>
            
            <div className="mb-5">
              <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.weight ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                placeholder="Enter your weight"
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            </div>

            <div className="mb-5">
              <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
            </>
          )}

          {formData.role !== 'donor' && (
            <>
              <div className="mb-5">
                <label htmlFor="facilityName" className="block text-gray-700 font-medium mb-2">
                  {formData.role === 'blood-bank' ? 'Blood Bank Name' : 'Hospital Name'}
                </label>
                <input
                  id="facilityName"
                  name="facilityName"
                  type="text"
                  value={formData.facilityName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.facilityName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                  placeholder={formData.role === 'blood-bank' ? "Enter blood bank name" : "Enter hospital name"}
                />
                {errors.facilityName && <p className="text-red-500 text-sm mt-1">{errors.facilityName}</p>}
              </div>

              <div className="mb-5">
                <label htmlFor="licenseNumber" className="block text-gray-700 font-medium mb-2">
                  {formData.role === 'blood-bank' ? 'Blood Bank License Number' : 'Hospital License Number'}
                </label>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.licenseNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                  placeholder="Enter license number"
                />
                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>

              <div className="mb-5">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="mb-5">
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-400'}`}
                  placeholder="Enter facility address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </>
          )}

          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2"
                />
              </div>
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                I agree to the <a href="#" className="text-red-600 hover:underline">Terms and Conditions</a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-75 flex items-center justify-center shadow-lg shadow-red-200"
          >
            {isLoading ? (
              "Creating Account..."
            ) : (
              'Create Account'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-red-600 hover:text-red-500">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}