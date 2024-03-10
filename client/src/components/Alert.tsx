
interface Props {
    subject: string;
    message: string;
    closeHandler: () => void;
}

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
