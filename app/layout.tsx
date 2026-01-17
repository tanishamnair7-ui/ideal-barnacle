import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relationship Profile Assessment",
  description: "Create your comprehensive relationship compatibility profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isVercelDeployment = process.env.VERCEL === '1';

  return (
    <html lang="en">
      <body className="antialiased">
        {isVercelDeployment && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2.5 text-center text-sm">
            <strong className="font-semibold">Demo Mode:</strong> This deployment stores data on cloud servers.
            For privacy-first local use, <a href="https://github.com/tanishamnair7-ui/ideal-barnacle" className="underline hover:text-yellow-900">run on your own machine</a>.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
