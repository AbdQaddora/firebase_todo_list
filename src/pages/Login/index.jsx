import { GoogleLogin } from '@react-oauth/google';
import { Row, message } from 'antd';
import './styles.css';
import { useAuth } from '../../context/AuthProvider';
import { Navigate } from 'react-router-dom';
const Login = () => {
    const { login, isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/" />
    }

    return (
        <Row align={'middle'} justify={'center'} className='login_page'>
            <GoogleLogin
                width={"100"}
                onSuccess={credentialResponse => {
                    login(credentialResponse)
                }}
                onError={(error) => {
                    console.log('error :>> ', error);
                    message.error('Login Failed')
                }}
            />
        </Row>
    )
}

export default Login