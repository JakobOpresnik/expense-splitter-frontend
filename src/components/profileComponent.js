import { useEffect, useState } from "react";


function Profile() {

    const [currentUser, setCurrentUser] = useState({});

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
        </div>
    )
}

export default Profile;