import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./headerComponent";
import Footer from "./footerComponent";
import { UserContext } from "../App";

function Groups() {

    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [joinGroup, setJoinGroup] = useState(false);

    const { currentUser } = useContext(UserContext);
    console.log(currentUser);

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/groups/entry");
    }

    const handleEventJoin = async (groupId) => {
        const updatedGroupData = {
            users: currentUser._id
        }

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
                setJoinGroup(true);
            }
            else {
                console.error("failed to add user to event");
            }
        }
        catch (error) {
            console.error(`call to API failed: ${error}`);
        }
        finally {
            setJoinGroup(true);
        }
    }

    const handleEventLeave = async (groupId) => {
        try {
            const response = await fetch(`http://localhost:9000/groups/${groupId}/remove/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                console.log("user successfully removed from event");
            }
            else {
                console.error("failed to add user to event");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
        finally {
            setJoinGroup(false);
        }
    }

    const handleEventSelection = async (groupId) => {
        navigate(`/groups/${groupId}`);
    }

    useEffect(() => {
        const getGroups = async () => {
            // get list of all groups
            try {
                setLoadingGroups(true);
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
            finally {
                setLoadingGroups(false);
            }
        }

        console.log("joined group: ", joinGroup);
        const isGroupJoined = async (groupId) => {
            try {
                const response = await fetch(`http://localhost:9000/groups/${groupId}/hasUser/${currentUser._id}`)
                console.log("has user", response);
                if (response.ok) {
                    setJoinGroup(true);
                }
                setJoinGroup(false);
            }
            catch(error) {
                console.error(`couldn't fetch groups: ${error}`);
            }
        }

        getGroups();
        isGroupJoined("6570cc5e5f43cc32058ee6cf");
    }, [joinGroup]);

    const myGroups = groups.filter(group => {
        return group.users.some(user => user === currentUser._id)
    });
    console.log(myGroups);
    
    return (
        <>
            {!loadingGroups && currentUser && groups && myGroups && (
                <div>
                    <Header />
                    <button onClick={handleRedirect}>ADD EVENT</button>
                    <h2>ALL CURRENTLY AVAILABLE EVENTS</h2>
                    <div class="listing">
                        {groups.map(group => (
                            <div class="event-info" key={group._id}>
                                <h3>{group.name}</h3>
                                <h4>max {group.people} people</h4>
                                {joinGroup && (
                                    <>
                                        <button onClick={() => handleEventSelection(group._id)}>VIEW</button>
                                        <button onClick={() => handleEventLeave(group._id)}>LEAVE</button>
                                    </>
                                )}
                                {!joinGroup && (
                                    <>
                                        <button onClick={() => handleEventJoin(group._id)}>JOIN</button>
                                    </>
                                )}
                                
                            </div>
                        ))}
                    </div>
                    <h2>YOUR EVENTS</h2>
                    <div class="listing">
                        {myGroups.map(myGroup => (
                            <div class="my-event-info" key={myGroup._id}>
                                <h3>{myGroup.name}</h3>
                                <h4>{myGroup.people}</h4>
                            </div>
                        ))}
                    </div>
                    <Footer />
                </div>
            )}
        </>
    );
}

export default Groups;