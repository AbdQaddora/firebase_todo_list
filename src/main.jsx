import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthProvider from './context/AuthProvider/index.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#461959",
          colorPrimaryText: "#2C2C2C",
          fontFamily: "'Poppins', sans-serif",
          borderRadius: 8,
          colorBorder: "#dedede",
          controlOutlineWidth: 1,
          controlHeight: 40,
        },
        components: {
          Typography: {
            sizeMarginHeadingVerticalStart: 0,
            sizeMarginHeadingVerticalEnd: 0,
          },
          Radio: {
            size: 24,
            colorPrimary: "#3A5EE3",
          },
          Tabs: {
            colorPrimary: "linear-gradient(270deg, #3A5EE3 0%, #8FCAF3 100%)",
          },
          Checkbox: {
            borderRadiusSM: 4,
            colorBgContainer: "transparent",
            colorPrimaryBorderHover: "#eee",
          },
        },
      }}
    >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ConfigProvider>
  </React.StrictMode>,
)
