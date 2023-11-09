import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile() {

    const [currentUser, setCurrentUser] = useState({});

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:9000/users/logout", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            navigate("/login");
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    useEffect(() => {

        async function getCurrentUser() {
            try {
                const response = await fetch("http://localhost:9000/users/current");
                const data = await response.json();
                setCurrentUser(data);
            }
            catch(error) {
                console.log(`call to API failed: ${error}`);
            }
        }

        getCurrentUser();
        
    }, []); // ensure this API endpoint is only called once

    return (
        <div>
            <h2>{currentUser.username}</h2>
            <p>{currentUser.email}</p>
            <p>Your current balance: {currentUser.balance}€</p>
            <button onClick={handleLogout}>LOGOUT</button>
        </div>
    )
}

export default Profile;