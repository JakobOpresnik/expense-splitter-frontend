import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./headerComponent";
import Footer from "./footerComponent";

function Group() {

    const params = useParams();
    const [group, setGroup] = useState({});

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
                }
            }
            catch(error) {
                console.error(`call to API failed: ${error}`);
            }
        }

        getGroup();
    }, []);

    return (
        <div>
            <Header />
            <h1>hello</h1>
            <h3>{group.name}</h3>
            <h3>{group.people}</h3>
            <button onClick={handleRedirect}>ADD PURCHASE</button>
            <Footer />
        </div>
    )
}

export default Group;