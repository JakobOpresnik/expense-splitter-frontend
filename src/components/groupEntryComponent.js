import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./headerComponent";
import Footer from "./footerComponent";

function GroupEntry() {
    const [groupData, setGroupData] = useState({
        name: "",
        people: ""
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupData({...groupData, [name]: value});
    }

    const handleNewEvent = async (e) => {
        e.preventDefault();

        const createGroupData = {
            name: groupData.name,
            people: groupData.people,
            users: [],
            purchases: [],
            transactions: 0
        }

        try {
            const response = await fetch("http://localhost:9000/groups", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createGroupData)
            });

            if (response.ok) {
                console.log("new group created");
                navigate("/groups");
            }
            else {
                console.error("group creation failed");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    return (
        <div>
            <Header />
            <h2>Create New Event</h2>
            <form onSubmit={handleNewEvent}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={groupData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="people">Max number of people:</label>
                    <input
                        type="text"
                        name="people"
                        value={groupData.people}
                        onChange={handleInputChange}
                    />
                </div>
                <button>CREATE NEW EVENT</button>
            </form>
            <Footer />
        </div>
    );
}

export default GroupEntry;