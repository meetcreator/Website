import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AnalyticsPro | B2B & B2C Business Intelligence",
    description: "Advanced analytics for modern businesses",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
