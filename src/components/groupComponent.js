import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./headerComponent";
import Footer from "./footerComponent";
import { UserContext } from "../App";

function Group() {

    const params = useParams();
    const [group, setGroup] = useState({});
    const [purchases, setPurchases] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);
    const [joined, setJoined] = useState(isGroupJoined);
    const [totalBalance, setTotalBalance] = useState(0);
    const [avgBalance, setAvgBalance] = useState(0);
    const [debtsList, setDebtsList] = useState([]);
    const navigate = useNavigate();

    const { currentUser } = useContext(UserContext);
    console.log("current user", currentUser);
    //setCurrentUser(currentUser);

    console.log(params.id)
    console.log("joined group? ", joined);

    async function isGroupJoined(groupId, user) {
        if (user) {
            const userId = user._id;
            try {
                const response = await fetch(`http://localhost:9000/groups/${groupId}/hasUser/${userId}`);
                console.log("has user", response);
                if (response.ok) {
                    const data = await response.json();
                    console.log("response is OK!", data);
                    if (data.message) {
                        setJoined(true);
                        return;
                    }
                    else {
                        setJoined(false);
                        return;
                    }
                }
            }
            catch(error) {
                console.error(`couldn't fetch groups: ${error}`);
            }
        }
    }

    // get sum of all users' balances
    async function calculateTotalBalance(users) {
        const sum = users.reduce((accumulator, user) => {
            return accumulator + user.balance;
        }, 0);

        setTotalBalance(sum);
    }

    // calculate users' debts
    async function calculateDebts(users) {
        const debts = [];
        console.log("total", totalBalance);
        const avg = totalBalance / users.length;
        setAvgBalance(avg);
        console.log("average", avg);

        const allDebts = users.map(user => {
            return ({
                value: avg - user.balance,
                user: user.username,
            })}
        );
        console.log("debts", allDebts);

        const areOwed = allDebts.filter(debt => debt.value < 0);
        const numOwed = areOwed.length;

        const sumOwed = areOwed.reduce((accumulator, val) => {
            return accumulator + val.value;
        }, 0);

        console.log("are owed", areOwed);
        console.log("sum owed", sumOwed);

        const proportions = [];
        for (let debt of allDebts) {
            console.log("owed value", debt.value);
            const d = {
                value: debt.value > 0 ? Math.abs(debt.value / sumOwed) : 0,
                user: debt.value > 0 ? debt.user : "",
            }
            proportions.push(d);
        }
        console.log("proportions", proportions);

        for (let user of users) {
            let userDebt = [];
            const owedValue = avg - user.balance;
            userDebt.push({
                value: user.balance,
                user: user.username,
            });
            userDebt.push({
                value: owedValue,
                user: user.username,
            });
            for (let proportion of proportions) {
                const debt = {
                    value: owedValue < 0 ? owedValue * proportion.value : 0,
                    user: owedValue < 0 ? proportion.user : "",
                };
                userDebt.push(debt);
            }
            debts.push(userDebt);
        }

        console.log("final debts", debts);
        setDebtsList(debts);
    }

    // redirect to new purchase entry page
    const handleRedirect = () => {
        navigate(`/groups/${params.id}/purchases/entry`);
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
                setJoined(true);
            }
            else {
                console.error("failed to add user to event");
            }
        }
        catch (error) {
            console.error(`call to API failed: ${error}`);
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
                setJoined(false);
            }
            else {
                console.error("failed to add user to event");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    /* const removePurchase = async (purchaseId) => {
        try {
            const response = await fetch(`http://localhost:9000/purchases/${purchaseId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const removedPurchase = await response.json();
                console.log("removed purchase", removedPurchase);
                // update user's balance based on the deleted purchase
                currentUser.balance = currentUser.balance + removedPurchase.cost;
                console.log("successfully removed purchase");
                console.log("new user balance after removed purchase: ", currentUser.balance);
                const newBalanceData = {
                    balance: currentUser.balance,
                };
                try {
                    const response = await fetch(`http://localhost:9000/users/${currentUser._id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newBalanceData),
                    });
                    if (response.ok) {
                        console.log("user's balance successfully updated");
                    }
                    else {
                        console.error("balance update failed");
                    }
                }
                catch(error) {
                    console.error(`call to API failed: ${error}`);
                }
            }
            else {
                console.error("failed to remove purchase");
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    } */

    useEffect(() => {
        async function getGroup() {
            try {
                const response = await fetch(`http://localhost:9000/groups/${params.id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setGroup(data);
                    
                    console.log("users", data.users);
                    console.log(data.purchases);
    
                    // get all purchases (entire objects, not just their IDs)
                    try {
                        var purchases = [];
                        for (let purchaseId of data.purchases) {
                            console.log(purchaseId);
                            const response = await fetch(`http://localhost:9000/purchases/${purchaseId}`);
                            if (response.ok) {
                                const purchaseData = await response.json();
    
                                console.log(purchaseData);
                                console.log(purchaseData.user);
    
                                try {
                                    const response = await fetch(`http://localhost:9000/users/${purchaseData.user}`);
                                    if (response.ok) {
                                        const userData = await response.json();
                                        purchaseData.user = userData
                                        purchases.push(purchaseData);
                                    }
                                    else {
                                        console.error("error getting user");
                                    }
                                }
                                catch(error) {
                                    console.error(`call to API failed: ${error}`);
                                }
                            }
                            else {
                                console.error("error getting purchases");
                            }
                        }
                        setPurchases(purchases);
                        console.log(purchases);
                    }
                    catch(error) {
                        console.error(`call to API failed: ${error}`);
                    }


                    // get all users (entire objects not just their IDs)
                    try {
                        var users = []
                        for (let userId of data.users) {
                            const response = await fetch(`http://localhost:9000/users/${userId}`);
                            if (response.ok) {
                                const userData = await response.json();
                                console.log(userData);
                                users.push(userData);
                            }
                            else {
                                console.error("error getting users");
                            }
                        }
                        setGroupUsers(users);
                        console.log("all group users:", users);
                    }
                    catch(error) {
                        console.error(`call to API failed: ${error}`);
                    }

                }
                else {
                    console.error("error getting groups");
                }
            }
            catch(error) {
                console.error(`call to API failed: ${error}`);
            }
        }

        getGroup();
        isGroupJoined(group._id, currentUser);
        calculateTotalBalance(groupUsers);
        calculateDebts(groupUsers);
    }, [params.id, joined, currentUser, groupUsers]);

    console.log(currentUser);
    console.log(groupUsers);


    return (
        <div>
            <Header />
            <div class="group-div">
                <h3 id="group-name">{group.name}</h3>
                { !joined ? groupUsers.length < group.people ? (
                    <>
                        <h2>Would you like to join this event?</h2>
                        <button class="join-group-btn" onClick={() => handleEventJoin(group._id)}>JOIN</button>
                    </>
                ) : (<h2>This group is already full</h2>) : (
                    <button class="leave-group-btn" onClick={() => handleEventLeave(group._id)}>LEAVE EVENT</button>
                )}
                <p style={{color: groupUsers.length >= group.people ? "red" : ""}}>{groupUsers.length} / {group.people} members</p>
                <h2>PURCHASES:</h2>
                <div class="listing">
                    { purchases.length ? 
                        purchases.map(purchase => (
                        <div class="purchase-info" key={purchase._id}>
                            <h3>{purchase.name}</h3>
                            <p>price: {purchase.cost}€</p>
                            <p>done by: {purchase.user.username}</p>
                            { /* purchase.user.username === currentUser.username && (
                                <button class="remove-purchase-btn" onClick={() => removePurchase(purchase._id)}>REMOVE</button>
                            ) */}
                        </div>
                    )) : "" }
                </div>
                { joined && (
                    <button class="add-purchase-btn" onClick={handleRedirect}>ADD PURCHASE</button>
                )}
                <div class="other-stats">
                    <p>TOTAL MONEY SPENT: <b>{Math.abs(totalBalance)}€</b></p>
                    <p>AVERAGE MONEY SPENT PER MEMBER: <b>{Math.abs(avgBalance)}€</b></p>
                </div>
                <table class="debts-table">
                    <tbody>
                        <tr>
                            <td style={{backgroundColor: "#304cff"}}><b>member</b></td>
                            <td style={{backgroundColor: "#304cff"}}><b>balance</b></td>
                            <td style={{backgroundColor: "#304cff"}}><b>debt</b></td>
                            {groupUsers.map(user => (
                                <td style={{backgroundColor: "#304cff"}}><b>debt to {user.username}</b></td>
                            ))}
                        </tr>
                        {debtsList.map((debtList, debtListIndex) => (
                            <tr key={debtListIndex}>
                                <td style={{backgroundColor: "#304cff"}}><b>{debtsList[debtListIndex][0].user}</b></td>
                                {debtList.map((debt, debtIndex) => (
                                    <td key={debtIndex} style={{backgroundColor: debt.value !== 0 ? debt.value > 0 ? "rgb(0, 165, 0)" : "rgb(255, 39, 39)" : "rgb(180, 180, 180)"}}>
                                        {debt.value !== 0 && debtIndex > 0 ? debt.value < 0 ? `owes ${parseFloat(Math.abs(debt.value).toFixed(2))}€` : `is owed ${parseFloat(Math.abs(debt.value).toFixed(2))}€` : debtIndex === 0 ? `${parseFloat(debt.value).toFixed(2)}€` : ``}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    )
}

export default Group;