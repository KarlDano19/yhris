import React from 'react';
import YahshuaPayrollLogo from '@/svg/YahshuaPayrollLogo';

function YahshuaPayrollButton() {
  const loginWithYahshuaPayroll = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/sso/login/yahshua-payroll-oauth`;
  };

  return (
    <button
      className='flex items-center justify-center text-indigo-dye mt-4 font-semibold bg-white border border-gray-400 w-full lg:w-full lg:px-10 py-2.5 rounded-md disabled:opacity-50'
      onClick={() => loginWithYahshuaPayroll()}
    >
      <div className='mx-1'>
        <YahshuaPayrollLogo />
      </div>{' '}
      YAHSHUA Payroll
    </button>
  );
}

export default YahshuaPayrollButton;
