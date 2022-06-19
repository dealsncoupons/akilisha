import { useState } from "react";
import firebaseAuthService from "../service/firebase-auth";

function LoginForm({ user }) {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await firebaseAuthService.loginUser(username, password);
            setUserName('');
            setPassword('');
        } catch (error) {
            alert(error.message);
        }
    }

    function handleLogout() {
        firebaseAuthService.logoutUser()
    }

    async function handleResetPassword(){
        if(!username){
            alert('Missing username');
            return;
        }
        try {
            await firebaseAuthService.resetPassword(username);
            alert("reset password email sent");
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleLoginWithGoogle(){
        try {
            await firebaseAuthService.loginWithGoogle();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="login-form-container">
            {
                user ?
                    <div>
                        <h3>Welcome, {user.email}</h3>
                        <button type="button" className="primary-button" onClick={handleLogout}>Logout</button>
                    </div> :
                    <form onSubmit={handleSubmit} className="login-form">
                        <label className="input-label login-label">
                            Username (email):
                            <input type="email"
                                required
                                value={username}
                                onChange={e => setUserName(e.target.value)}
                            />
                        </label>
                        <label className="input-label login-label">
                            Password:
                            <input type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </label>
                        <div className="button-box">
                            <button type="submit" className="primary-button">Login</button>
                            <button type="button" className="primary-button" onClick={handleResetPassword}>Reset Password</button>
                            <button type="button" className="primary-button" onClick={handleLoginWithGoogle}>Login with Google</button>
                        </div>
                    </form>
            }
        </div>
    )
}


export default LoginForm;