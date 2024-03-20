'use client'
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';

const AuthChecker: FC<{children: ReactNode}> = ({ children }) => {

    const {ready, authenticated} = usePrivy();
    const router = useRouter();

    if (!ready) {
        // Do nothing while the PrivyProvider initializes with updated user state
        return <></>;
    }

    if (ready && !authenticated) {
        router.push('/')
    }

    return (
        <>{children}</>
    )
}

export default AuthChecker;