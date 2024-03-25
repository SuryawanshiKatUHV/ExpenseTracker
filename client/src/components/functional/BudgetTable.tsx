interface Props {
    userId: number;
}

const BudgetTable = ({userId}:Props) => {
    return <>Budget table {userId}</>;
}

export default BudgetTable;