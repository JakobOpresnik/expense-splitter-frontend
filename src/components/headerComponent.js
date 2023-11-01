import { Link } from "react-router-dom";


function Header() {

    return (
        <header>
            <nav>
            <ul class="nav-list">
                <li>
                    <Link to="/home">DASHBOARD</Link>
                </li>
                <li>
                    <Link to="/groups">GROUPS</Link>
                </li>
                <li>
                    <Link to="/profile">PROFILE</Link>
                </li>
                <li>
                    <Link to="/settings">SETTINGS</Link>
                </li>
            </ul>
            </nav>
        </header>
    )
}

export default Header;