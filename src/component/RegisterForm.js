import { useState } from "react";
import firebaseAuthService from "../service/firebase-auth";

function LoginForm({ user }) {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await firebaseAuthService.registerUser(username, password);
            setUserName('');
            setPassword('');
        } catch (error) {
            alert(error.message);
        }
    }

    function handleLogout() {
        firebaseAuthService.logoutUser()
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
                            <button type="submit" className="primary-button">Submit</button>
                        </div>
                    </form>
            }
        </div>
    )
}


export default LoginForm;