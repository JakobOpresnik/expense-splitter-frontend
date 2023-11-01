import Header from "./headerComponent";
import Footer from "./footerComponent";
import { useEffect, useState } from "react";

function Home() {

    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {

        async function getCurrentUser() {
            try {
                const response = await fetch("http://localhost:9000/users/current");
                const data = await response.json();
                setCurrentUser(data.username);
            }
            catch(error) {
                console.error(`call to API failed: ${error}`);
            }
        }

        getCurrentUser();
        
    }, []); // ensure this API endpoint is only called once
 
    return (
        <div>
            <Header />
            <h1 id="home-title">
                Welcome to your dashboard, {currentUser}
            </h1>
            <Footer />
        </div>
    )
}

export default Home;