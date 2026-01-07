import Content from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/pages/transactions/Content";
import PersonalModeLayout from "@/components/pages/(auth)/yahshua-connect/tabs/personal-mode/PersonalModeLayout";

export const metadata = {
  title: "Transactions - YAHSHUA CONNECT",
  description: "View your transaction history - YAHSHUA Student Information System",
};

const TransactionsPage = async () => {
  return (
    <PersonalModeLayout>
      <Content />
    </PersonalModeLayout>
  );
};

export default TransactionsPage;

