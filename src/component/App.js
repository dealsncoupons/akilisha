import {useState} from 'react';
import firebaseAuthService from '../service/firebase-auth';
import './App.css';
import LoginForm from './LoginForm';

function App() {
  const [user, setUser] = useState(null);

  firebaseAuthService.subscribeToAuthChanges(setUser);

  return (
    <div className="App">
      <div className='title-row'>
        <h2 className='title'>Firebase Marketplace</h2>
        <LoginForm user={user} />
      </div>
    </div>
  );
}

export default App;
