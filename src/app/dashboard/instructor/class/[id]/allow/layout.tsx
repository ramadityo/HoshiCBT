import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Allow Users",
    description: "Allow access for user"
}

export default function RootLayout({ children } : { children : React.ReactNode}){
    return (
        <html>
            <body>
                { children }
            </body>
        </html>
    )
}