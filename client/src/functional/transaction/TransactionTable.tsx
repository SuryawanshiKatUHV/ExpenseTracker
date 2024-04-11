interface Props {
    userId: number;
}

const TransactionTable = ({userId} : Props) => {
    return <>Transactions table by user {userId}</>;
}

export default TransactionTable;