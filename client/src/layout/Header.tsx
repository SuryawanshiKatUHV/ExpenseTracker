interface Props {
  userFullName: string;
  logoutHandler : () => void;
}

/**
 * Header component displays user information and logout button.
 * @param {Props} userFullName - Full name of the logged-in user.
 * @param {Props} logoutHandler - Handler function for logout action.
 * @returns {JSX.Element} The rendered Header component.
 */
const Header = ({userFullName, logoutHandler} : Props) => {
  return (
    <>
      <div style={{ backgroundColor: '#f0f0f0', padding: '2px', textAlign: 'right' }}>
        {userFullName} | <button className="btn btn-link" onClick={logoutHandler}>Logout</button>
      </div>
    </>
  );
};

export default Header;