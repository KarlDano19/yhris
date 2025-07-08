'use client';

import updateSession from '@/helpers/updateSession';
import { setCookie } from 'cookies-next';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function Content() {
    const broadcastChannel = new BroadcastChannel('integration-channel');
    const searchParams = useSearchParams();

    const setSession = (data: any) => {
        setCookie('token', data.token, {
            maxAge: 60 * 60 * 3,
            sameSite: 'strict',
            httpOnly: false,
            secure: true,
          });

          if (data.account_type === 'employer') {
            if (data.has_profile) {
                const returnTo = searchParams.get('redirect') || '/dashboard';
                location.href = returnTo;
            } else {
                location.href = '/setup-employer-profile';
            }
          }
    }

    const setSSOSession = async (data: any) => {
        await updateSession({
            token: data.token,
            email: data.email,
            hasPendingTransaction: data.has_pending_transaction,
            hasActiveSubscription: data.has_active_subscription,
            hasProfile: data.has_profile,
            accountType: data.account_type,
            loginType: data.login_type,
            isLoggedIn: true,
        })
        setSession(data);
    }

    useEffect(() => {
        broadcastChannel.onmessage = (event) => {
            if (event.data.isGranted) {
                setSSOSession(event.data);
            }
        };
        
        loginWithYahshuaPayroll();
        
        return () => {
            broadcastChannel.close();
        };
    }, []);

    const loginWithYahshuaPayroll = () => {
        const left = (window.innerWidth - 900) / 2;
        const top = (window.innerHeight - 700) / 2;
        const popup = window.open(
            `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/yahshua-payroll-oauth`,
            'popup',
            `width=900, height=900, left=${left}, top=${top}`
        );
        const checkOAuthStatus = setInterval(function () {
            if (popup?.closed) {
                clearInterval(checkOAuthStatus);
            }
        }, 1000);
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold'>Login with Yahshua Payroll</h1>
        </div>
    )
}

export default Content;