export const buildMonthlyData = (transactions = []) => {
    const revenue = Array(12).fill(0);
    const purchases = Array(12).fill(0);

    transactions.forEach((txn) => {
        const monthIndex = new Date(txn.created_at).getMonth();
        const amount = Number(txn.amount || 0);

        if (txn.txn_for === "visa") {
            revenue[monthIndex] += amount;
        }

        if (txn.txn_for === "course") {
            purchases[monthIndex] += 1;
        }
    });

    return { revenue, purchases };
};
