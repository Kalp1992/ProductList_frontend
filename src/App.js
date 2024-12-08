import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route,Switch, Link } from 'react-router-dom';
import Home from "./Home/Home";
import Product from "./Products/Product";
import About from "./About/About"

function App() {
  return (
    <Router>
       <nav style={styles.navbar}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/products" style={styles.navLink}>Products</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
        </nav>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/products" component={Product} />
          <Route path="/about" component={About} />
        </Switch>
    </Router>
  );
}
const styles = {
  navbar: { background: '#333', padding: '10px', textAlign: 'center' },
  navLink: { color: 'white', textDecoration: 'none', margin: '0 10px', fontSize: '18px' },
};
export default App;
