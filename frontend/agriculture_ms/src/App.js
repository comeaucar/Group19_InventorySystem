
import './App.css';

function App() {
  return (
    <div>
        <div class="bg"></div>
        <div id = "logintab">
            <div class="login-form">
                <h3 class="login-heading">Login</h3>
                <form class="login">
                    <input type="text" id="username" name="username" required placeholder="Username"></input>
                    <br></br>
                    <input type="password" id="password" name="password" required placeholder="Password"></input>
                    <br></br>
                    <div class="rememberme" style={{marginLeft: '10px', paddingLeft: '70px'}}>
                        <input type="checkbox" id="remember" name="rememberme"></input>
                        <label for="rememberme" style={{padding: '10px'}}>Remember Me</label>
                        
                    </div>
                    <label for="forgotpass" style={{paddingLeft: '12px'}}><br></br>Forgot Password?</label>
                    <button type="submit">Login</button>
                    
                </form>
            </div>
            
        </div>
    </div>
  );
}

export default App;
