import { useEffect, useState } from "react";
import { useActionData, useNavigate, useParams } from "react-router-dom";
import Header from "./headerComponent";
import Footer from "./footerComponent";

function Group() {

    const params = useParams();
    const [group, setGroup] = useState({});
    const [purchases, setPurchases] = useState([]);
    const [users, setUsers] = useState();

    const navigate = useNavigate();

    console.log(params.id)

    const handleRedirect = () => {
        navigate(`/groups/${params.id}/purchases/entry`);
    }

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
    
                    console.log(data.purchases);
    
                    try {
                        var purchases = [];
                        var users = []
                        for (let purchaseId of data.purchases) {
                            console.log(purchaseId);
                            const reponse = await fetch(`http://localhost:9000/purchases/${purchaseId}`);
                            if (response.ok) {
                                const purchaseData = await reponse.json();
                                //purchases.push(purchaseData)
    
                                console.log(purchaseData);
                                console.log(purchaseData.user);
    
                                try {
                                    const response = await fetch(`http://localhost:9000/users/${purchaseData.user}`);
                                    if (response.ok) {
                                        const userData = await response.json();
                                        purchaseData.user = userData
                                        purchases.push(purchaseData);
                                        //purchases.push(userData);
                                        //console.log(userData);
                                        //setUser(userData);
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
                        //setUsers(users);
                        console.log(purchases);
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
    }, [params.id]);

    return (
        <div>
            <Header />
            <h1>hello</h1>
            <h3>{group.name}</h3>
            <h3>max people: {group.people}</h3>
            <h3>Purchases:</h3>
            <div class="listing">
                { purchases.length ? 
                    purchases.map(purchase => (
                    <div class="purchase-info" key={purchase._id}>
                        <h3>{purchase.name}</h3>
                        <h4>price: {purchase.cost}€</h4>
                        <h4>done by: {purchase.user.username}</h4>
                    </div>
                )) : "" }
            </div>
            <button onClick={handleRedirect}>ADD PURCHASE</button>
            <Footer />
        </div>
    )
}

export default Group;