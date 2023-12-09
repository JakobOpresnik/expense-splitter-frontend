import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";


function Profile() {

    const [purchases, setPurchases] = useState([]);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    console.log(currentUser);

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

    const getUserPurchases = async () => {
        try {
            const response = await fetch(`http://localhost:9000/purchases/user/${currentUser._id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const data = await response.json();
                setPurchases(data);
                console.log("user purchases successfully fetched");
            }
            else {
                console.error("error fetching user purchases");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    console.log("purchases: ", purchases);

    return (
        <div>
            {currentUser && (
                <>
                    <h2>{currentUser.username}</h2>
                    <p>{currentUser.email}</p>
                    <p>Your current balance: {currentUser.balance}€</p>
                    <button onClick={handleLogout}>LOGOUT</button>
                </>
            )}
        </div>
    )
}

export default Profile;