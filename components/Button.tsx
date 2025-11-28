import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md",
    secondary: "bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500 border border-blue-200 shadow-sm",
    outline: "bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
};
