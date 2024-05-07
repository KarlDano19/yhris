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
      <div className="min-h-screen bg-white border-gray-100 border-t">
        {children}
      </div>
    </>
  );
}
