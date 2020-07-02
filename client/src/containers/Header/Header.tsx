import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';

const Header: React.FC = () => {
	const { loading, user } = useContext(UserContext);

	if (loading) {
		return <></>;
	}

	return (
		<header>
			<h1>OEC Data Collection</h1>
			<nav>
				{user ? <span>Hi, {user.firstName}</span> : <Link to="/login">Sign in</Link>}
				<p>{user && <Link to="/logout">Logout</Link>}</p>
			</nav>
		</header>
	);
}

export default Header;
