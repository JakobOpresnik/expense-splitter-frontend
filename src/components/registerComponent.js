import { useState } from "react";
import { Link } from "react-router-dom";


function Register() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

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
            token: ''
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
            }
            else {
                console.error("registration failed");
            }
        }
        catch(error) {
            console.error(`call to API failed ${error}`);
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
            <button type="submit">Register</button>
            <Link to='/login'>already have an account?</Link>
          </form>
        </div>
      );
}

export default Register;