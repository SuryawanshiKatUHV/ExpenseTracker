interface Props {
    subject: string;
    message: string;
    closeHandler: () => void;
}

/**
* The Alert component renders a customizable toast message using the React Toastify library.
 * @param {Props} subject - The subject of the alert
 * @param {Props} message - The message content of the alert
 * @param {Props} closeHandler - Function to handle closing the alert
 */
function Alert({subject, message, closeHandler} : Props) {
  return (
    <div className="toast" style={{display:'block'}} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
            <strong className="me-auto">{subject}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={closeHandler}></button>
        </div>
        <div className="toast-body">
            {message}
        </div>
    </div>
  );
}

export default Alert;
