interface Props {
  userFullName: string;
  logoutHandler : () => void;
}

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