import Header from "./headerComponent";
import Footer from "./footerComponent";
import { useContext } from "react";
import { UserContext } from "../App";

function Home() {

    const { currentUser } = useContext(UserContext);
    //console.log(currentUser.username);
 
    return (
        <>
            <Header />
            <h1 id="home-title">
                Welcome to your dashboard, {currentUser.username}
            </h1>
            <Footer />
        </>
    )
}

export default Home;