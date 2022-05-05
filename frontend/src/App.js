import logo from './logo.svg';
import './App.css';
import Home from './containers/home'
import {
  RecoilRoot 
} from 'recoil'
function App() {
  return (
    <RecoilRoot>
      <Home/>

    </RecoilRoot>
  );
}

export default App;
