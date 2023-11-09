import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./headerComponent";
import Footer from "./footerComponent";

function Groups() {

    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/groups/entry");
    }

    const handleEventJoin = async (groupId) => {
        try {
            const response = await fetch("http://localhost:9000/users/current");

            if (response.ok) {
                console.log(groups);
                const data = await response.json();

                const userId = data._id;
                //console.log(userId);

                const updatedGroupData = {
                    users: userId
                }

/*                 const filteredGroups = groups.filter(group => group.users[0] == userId);
                console.log(filteredGroups);
                setMyGroups(filteredGroups); */

                console.log(userId);

                try {
                    const response = await fetch(`http://localhost:9000/groups/${groupId}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedGroupData)
                    });

                    if (response.ok) {
                        console.log("user successfully added to event");
                        

    /*                     console.log(groups);
                        const groupToJoin = groups.find(group => group._id == groupId);
                        console.log(groupToJoin);
                        myGroups.push(groupToJoin);
                        //setMyGroups([...myGroups, groupToJoin]);
                        console.log(myGroups); */
                    }
                    else {
                        console.error("failed to add user to event");
                    }
                }
                catch(error) {
                    console.error(`call to API failed: ${error}`);
                }
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    const handleEventLeave = async (groupId) => {
        // TODO:
        // - get current user
        // - remove current user from array of users of clicked group (find by groupId)
        // - create separate API endpoints to handle adding/removing users & purchases (instead of just having 1 update endpoint)
    }

    const handleEventSelection = async (groupId) => {
        navigate(`/groups/${groupId}`);
    }

    const getGroups = async () => {
        // get list of all groups
        try {
            const response = await fetch("http://localhost:9000/groups", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setGroups(data);
            }
            else {
                console.error("failed to fetch data");
            }
        }
        catch(error) {
            console.error(`couldn't fetch groups: ${error}`);
        }
    }


    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await fetch("http://localhost:9000/users/current", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setCurrentUserId(data._id);
                    console.log(groups);
                    const filteredGroups = groups.filter(group => group.users[0] === currentUserId);
                    setMyGroups(filteredGroups);
                    console.log(myGroups);
                }
                else {
                    console.error("failed to fetch data");
                }
            }
            catch(error) {
                console.error(`call to API failed: ${error}`);
            }
        }

        getGroups();
        getCurrentUser();
    }, [currentUserId, groups, myGroups]);


    return (
        <div>
            <Header />
            <button onClick={handleRedirect}>ADD EVENT</button>
            <h2>ALL CURRENTLY AVAILABLE EVENTS</h2>
            <div>
                {groups.map(group => (
                    <div class="event-info" key={group._id} onClick={() => handleEventSelection(group._id)}>
                        <h3>{group.name}</h3>
                        <h4>max {group.people} people</h4>
                        <button onClick={() => handleEventJoin(group._id)}>JOIN</button>
                        <button onClick={() => handleEventLeave(group._id)}>LEAVE</button>
                    </div>
                ))}
            </div>
            <h2>YOUR EVENTS</h2>
            <div>
                {/* {groups.map(group => {
                    if (group.users.includes(currentUserId)) {
                        return (
                            <div class="my-event-info">
                                <h3>{group.name}</h3>
                                <h4>max {group.people} people</h4>
                            </div>
                        )
                    }
                    return null;
                })} */}
                {myGroups.map(myGroup => (
                    <div class="my-event-info" key={myGroup._id}>
                        <h3>{myGroup.name}</h3>
                        <h4>{myGroup.people}</h4>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default Groups;