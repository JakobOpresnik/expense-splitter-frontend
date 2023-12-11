import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import Header from "./headerComponent";
import Footer from "./footerComponent";

function Profile() {

    const [purchases, setPurchases] = useState([]);
    const [editProfileMode, setEditProfileMode] = useState(false);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [updatedUserData, setUpdatedUserData] = useState({
        username: "",
        password: "",
    });

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

    /* const getUserPurchases = async () => {
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
    console.log("purchases: ", purchases); */

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData({...updatedUserData, [name]: value});
    }

    const handleEditUser = async (e) => {{
        e.preventDefault();

        const updatedData = {
            username: updatedUserData.username,
            email: updatedUserData.email,
        }

        try {
            const response = await fetch(`http://localhost:9000/users/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                console.log("user update successful");
                setEditProfileMode(false);
            }
            else {
                console.error("user update failed");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }} 

    const editProfile = async () => {
        setEditProfileMode(true);
    }

    return (
        <div>
            <Header />
            {currentUser && (
                <>
                    {!editProfileMode ? (
                        <div class="user-profile">
                            <h2 id="user-name-title">{currentUser.username}</h2>
                            <p>E-mail: <b>{currentUser.email}</b></p>
                            <p>Your current balance: <b>{currentUser.balance}€</b></p>
                            <button class="edit-profile-btn" onClick={editProfile}>EDIT PROFILE</button>
                            <button class="logout-btn" onClick={handleLogout}>LOGOUT</button>
                        </div>
                    ) : (
                        <form class="user-profile" onSubmit={handleEditUser}>
                            <div>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                name="username"
                                //value={updatedUserData.username}
                                defaultValue={currentUser.username}
                                onChange={handleInputChange}
                            />
                            </div>
                            <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                //value={updatedUserData.email}
                                defaultValue={currentUser.email}
                                onChange={handleInputChange}
                            />
                            </div>
                            <button class="update-profile-btn" type="submit">UPDATE USER</button>
                        </form>
                    )}
                </>
            )}
            <Footer />
        </div>
    )
}

export default Profile;