import FloatingHelpButton from "@/components/FloatingHelpButton";

export const metadata = {
  title: "Home - Yahshua HRIS",
  description: "HRIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        {children}
      </div>
      <FloatingHelpButton />
    </>
  );
}
