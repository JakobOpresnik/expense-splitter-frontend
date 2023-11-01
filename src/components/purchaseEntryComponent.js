import Header from "./headerComponent";
import Footer from "./footerComponent";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PurchaseEntry() {

    const [purchaseData, setPurchaseData] = useState({
        name: "",
        cost: "",
        user: ""
    });

    const [purchaseId, setPurchaseId] = useState();

    const navigate = useNavigate();

    const params = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPurchaseData({...purchaseData, [name]: value});
    }

    const handleNewPurchase = async (e) => {
        e.preventDefault();

        const createPurchaseData = {
            id: Math.floor(Math.random * 1000),
            name: purchaseData.name,
            cost: purchaseData.cost,
            user: purchaseData.user,
        }

        try {
            const response = await fetch("http://localhost:9000/purchases", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createPurchaseData)
            });

            if (response.ok) {
                console.log("new purchase created");

                const response = await fetch("")

                const updatedGroupData = {
                    purchases: createPurchaseData.id
                }
                
                try {
                    const response = await fetch(`http://localhost:9000/groups/${params.id}`, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedGroupData)
                    })
                    if (response.ok) {
                        console.log("purchase successfully added to event");
                    }
                    else {
                        console.error("failed to add purchase to event");
                    }
                }
                catch(error) {
                    console.error(`call to API failed: ${error}`);
                }
                
                window.history.back();
            }
        }
        catch(error) {
            console.error(`call to API failed: ${error}`);
        }
    }

    return (
        <div>
        <Header />
        <h2>Create New Purchase</h2>
        <form onSubmit={handleNewPurchase}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={purchaseData.name}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="cost">Cost:</label>
                <input
                    type="text"
                    name="cost"
                    value={purchaseData.cost}
                    onChange={handleInputChange}
                />
            </div>
            <button>CREATE NEW PURCHASE</button>
        </form>
        <Footer />
    </div>
    )
}

export default PurchaseEntry;