import { useState } from "react";
import { Link, useParams } from "react-router-dom";


function Login() {
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    });

    const { id } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({...userData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

/*         const loginData = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            token: true
        } */

        try {
            const response = await fetch(`http://localhost:9000/users/login/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                //body: JSON.stringify(loginData)
            });

            if (response.ok) {
                console.log("login successful");
            }
            else {
                console.error("login failed");
            }
        }
        catch(error) {
            console.error(`call to API failed ${error}`);
        }
    }

    return (
        <div>
          <h2>User Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                name="username"
                value={userData.username}
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
            <button type="submit">Login</button>
            <Link to="/">don't have an account yet?</Link>
          </form>
        </div>
      );
}

export default Login;