import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function Register() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({...userData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const registrationData = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            token: false
        }

        try {
            const response = await fetch("http://localhost:9000/users", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData)
            });

            if (response.ok) {
                console.log("registration successful");
                
                // redirect to /home page
                navigate("/login");
            }
            else {
                console.error("registration failed");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    return (
        <div>
          <h2>User Registration</h2>
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
              <label htmlFor="email">Email:</label>
              <input
                type="email"
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
            <button type="submit">REGISTER</button>
            <Link id="already-have-account" to='/login'>already have an account?</Link>
          </form>
        </div>
      );
}

export default Register;