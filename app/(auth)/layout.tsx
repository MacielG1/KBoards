export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full grid place-content-center">{children}</div>;
}
