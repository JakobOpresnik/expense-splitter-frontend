import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Login() {
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({...userData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            email: userData.email,
            password: userData.password,
        }

        try {
            const response = await fetch("http://localhost:9000/users/login", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                console.log("login successful");

                navigate("/home");
            }
            else {
                console.error("login failed");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    return (
        <div>
          <h2>User Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">E-mail:</label>
              <input
                type="text"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">LOGIN</button>
            <Link id="no-account-yet" to="/">don't have an account yet?</Link>
          </form>
        </div>
      );
}

export default Login;