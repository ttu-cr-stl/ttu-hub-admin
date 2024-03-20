import { PrivyProvider } from "@privy-io/react-auth";

const privyId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;


export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider 
            appId = {privyId || ''}
            config = {{
                // Display email and wallet as login methods
                loginMethods: ['email', 'wallet'],
                // Customize Privy's appearance in your app
                appearance: {
                theme: 'light',
                accentColor: '#676FFF',
                logo: 'https://your-logo-url',
                },
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}