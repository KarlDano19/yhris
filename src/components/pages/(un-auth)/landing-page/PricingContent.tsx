'use client';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import Navigation from './Navigation';
import Footer from './Footer';

import { CheckIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface PricingContentProps {
  isLoggedIn: boolean;
}

const PricingContent: React.FC<PricingContentProps> = ({ isLoggedIn }) => {
  const [employeeCount, setEmployeeCount] = useState(1);
  const router = useRouter();

  // Mock variables for the button functionality - these should be properly implemented
  const [periodicity] = useState<'monthly' | 'yearly'>('monthly'); // This should come from your pricing state
  const periodicityDuration = 12; // This should come from your pricing state
  const slug = 'hris'; // This should be the product slug

  const calculatePrice = (employees: number) => {
    const basePrice = 4000;

    if (employees <= 100) {
      return basePrice;
    }

    let additionalPrice = 0;
    let remainingEmployees = employees - 100;

    // 101-250: P39 each
    if (remainingEmployees > 0) {
      const tier1 = Math.min(remainingEmployees, 150); // 250-100 = 150
      additionalPrice += tier1 * 39;
      remainingEmployees -= tier1;
    }

    // 251-500: P37 each
    if (remainingEmployees > 0) {
      const tier2 = Math.min(remainingEmployees, 250); // 500-250 = 250
      additionalPrice += tier2 * 37;
      remainingEmployees -= tier2;
    }

    // 500+: P35 each
    if (remainingEmployees > 0) {
      additionalPrice += remainingEmployees * 35;
    }

    return basePrice + additionalPrice;
  };

  const calculateTotalPriceWithVAT = (price: number) => {
    
    let totalPrice = price + (price * 0.12);
    return totalPrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Navigation />
      <main className='relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24'>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className='relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          {/* Header Section */}
          <div className='text-center mb-16'>
            <h1 className='text-4xl md:text-6xl font-bold text-indigo-dye mb-6'>
              Simple, <span className='text-[#FFC107]'>Transparent</span> Pricing
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Choose the perfect plan for your business needs. Get the complete HRIS solution, add our powerful payroll
              system, or bundle both for maximum savings.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className='max-w-screen-2xl mx-auto grid lg:grid-cols-2 mb-16 justify-items-center'>
            {/* HRIS Only */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-[#355FD0] border-2 overflow-hidden max-w-md w-full'>
              <div className='bg-[#355FD0] text-white text-center py-6'>
                <h2 className='text-2xl font-bold mb-2'>YAHSHUA HRIS Freemium</h2>
                <p className='text-white'>Your simple hiring toolkit - always free</p>
              </div>
              <div className='p-6'>
                <div className='text-center mb-6'>
                  <p className='text-sm text-amber-600 font-semibold mb-2'>Introductory Price</p>
                  <div className='flex items-baseline justify-center mb-2'>
                    <span className='text-4xl font-bold text-indigo-dye'>₱0</span>
                    <span className='text-lg text-gray-600 ml-2'>/month</span>
                  </div>
                  <p className='text-gray-600'>No credit card required</p>
                </div>
                <ul className='space-y-3 mb-8'>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Post a Job in Multiple Platforms</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Screen Applicants in one place</span>
                  </li>
                </ul>
                <p className='text-sm text-[#355FD0] font-semibold mb-2'>Best for:</p>
                <ul className='space-y-3 mb-8 list-disc'>
                  <li className='ml-6 items-start gap-2 text-sm'>Startups and Small Businesses</li>
                  <li className='ml-6 items-start gap-2 text-sm'>Exploring digital hiring solutions</li>
                  <li className='ml-6 items-start gap-2 text-sm'>Getting a feel for YAHSHUA HRIS</li>
                </ul>
                <p className='text-sm text-[#355FD0] font-semibold mb-2'>Ready to grow?</p>
                <ul className='space-y-3 mb-8'>
                  <li className='flex items-start gap-2'>
                    <span className='text-sm'>Upgrade anytime to unlock the complete HR suite</span>
                  </li>
                </ul>
              </div>
              <div className='p-6 pt-20'>
                <button
                  className='block w-full text-center px-6 py-3 bg-gradient-to-r from-[#355FD0] to-[#25C3E6] text-white rounded-lg font-medium transition-colors hover:from-[#25C3E6] hover:to-[#355FD0]'
                  onClick={() => {
                    router.push('/signup');
                  }}
                >
                  Start Free Plan
                </button>
              </div>
            </div>

            <div className='bg-gradient-to-r from-[#FA7417] to-[#FABE23] max-w-md w-full rounded-[20px] p-[3px] shadow-2xl'>
              <div className='bg-white/80 backdrop-blur-sm rounded-[18px] max-w-md w-full'>
                <div className='bg-white/80 backdrop-blur-sm rounded-[18px] shadow-xl overflow-hidden max-w-md w-full'>
                  <div className='bg-gradient-to-r from-[#FFC107] to-amber-500 text-black text-center py-6'>
                    <h2 className='text-2xl font-bold mb-2'>YAHSHUA HRIS</h2>
                    <p className='text-amber-900'>Complete HR Management</p>
                  </div>
                  <div className='p-6'>
                    {/* Pricing Calculator */}
                    <div className='mb-6'>
                      <h3 className='text-lg font-bold text-indigo-dye mb-4 text-center'>Pricing Calculator</h3>
                    </div>

                    {/* Employee Count Input */}
                    <div className='mb-8'>
                      <label className='block text-sm font-medium text-gray-700 mb-3'>Input Number of Employees</label>
                      <div className='relative'>
                        <input
                          type='number'
                          min='1'
                          step='1'
                          value={employeeCount}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (inputValue === '') {
                              setEmployeeCount(1);
                            } else {
                              const value = parseInt(inputValue, 10);
                              if (!isNaN(value) && value >= 1) {
                                setEmployeeCount(value);
                              }
                            }
                          }}
                          className='w-full px-4 py-3 text-lg font-semibold text-indigo-dye bg-white border-2 border-gray-200 rounded-lg focus:border-[#FFC107] focus:ring-2 focus:ring-[#FFC107]/20 focus:outline-none transition-all duration-300 text-center shadow-lg hover:shadow-xl focus:shadow-xl'
                          placeholder='Enter number of employees'
                          aria-label='Number of employees'
                        />
                      </div>
                      <div className='text-center text-xs text-gray-500 mt-2'>
                        <span>Minimum: 1 employee</span>
                      </div>
                    </div>

                    <div className='text-center mb-6'>
                      <p className='text-sm text-amber-600 font-semibold mb-2'>Introductory Price</p>
                      <div className='flex items-baseline justify-center mb-2'>
                        <span className='text-4xl font-bold text-indigo-dye'>
                          {formatPrice((employeeCount <= 100 ? calculatePrice(employeeCount) : calculateTotalPriceWithVAT(calculatePrice(employeeCount))))}
                        </span>
                        <span className='text-lg text-gray-600 ml-2'>/month</span>
                      </div>
                      <p className='text-gray-600'>For 1 - 100 employees</p>
                      {employeeCount <= 100 && (
                        <p className='text-gray-600 text-xs'>*VAT Excluded</p>
                      )}

                      {/* Pricing Breakdown */}
                      {employeeCount > 100 && (
                        <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 text-left'>
                          <p className='text-blue-800 font-medium text-xs mb-2'>Pricing Breakdown:</p>
                          <div className='text-xs text-blue-700 space-y-1'>
                            <div className='flex justify-between'>
                              <span>Base (up to 100 employees):</span>
                              <span>₱4,000</span>
                            </div>
                            {employeeCount > 100 && employeeCount <= 250 && (
                              <div className='flex justify-between'>
                                <span>{Math.min(employeeCount - 100, 150)} employees × ₱39:</span>
                                <span>₱{(Math.min(employeeCount - 100, 150) * 39).toLocaleString()}</span>
                              </div>
                            )}
                            {employeeCount > 250 && (
                              <>
                                <div className='flex justify-between'>
                                  <span>150 employees × ₱39:</span>
                                  <span>₱{(150 * 39).toLocaleString()}</span>
                                </div>
                                {employeeCount <= 500 && (
                                  <div className='flex justify-between'>
                                    <span>{employeeCount - 250} employees × ₱37:</span>
                                    <span>₱{((employeeCount - 250) * 37).toLocaleString()}</span>
                                  </div>
                                )}
                              </>
                            )}
                            {employeeCount > 500 && (
                              <>
                                <div className='flex justify-between'>
                                  <span>250 employees × ₱37:</span>
                                  <span>₱{(250 * 37).toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between'>
                                  <span>{employeeCount - 500} employees × ₱35:</span>
                                  <span>₱{((employeeCount - 500) * 35).toLocaleString()}</span>
                                </div>
                              </>
                            )}
                            <div className='flex justify-between'>
                              <span>12% VAT:</span>
                              <span>₱{(calculatePrice(employeeCount) * 0.12).toLocaleString()}</span>
                            </div>
                            <div className='flex justify-between font-medium border-t border-blue-300 pt-1'>
                              <span>Monthly Total:</span>
                              <span>{formatPrice(calculateTotalPriceWithVAT(calculatePrice(employeeCount)))}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <ul className='space-y-3 mb-8'>
                      <li className='flex items-start gap-2'>
                        <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-sm'>Employee Management</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-sm'>Job Posting & Recruitment</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-sm'>Performance Management</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-sm'>DOLE Compliance Reports</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                        <span className='text-sm'>Document Management</span>
                      </li>
                      <li className='flex items-start gap-2 ml-7'>
                        <span className='text-sm'>
                          and <span className='text-black font-bold'>MORE!</span>
                        </span>
                      </li>
                    </ul>
                    <button
                      className='block w-full text-center px-6 py-3 bg-gradient-to-r from-[#FA7417] to-[#FFC107] text-white rounded-lg font-medium transition-colors hover:from-[#FFC107] hover:to-[#FA7417]'
                      onClick={() => {
                        if (isLoggedIn) {
                          let params: any = {
                            additional_employee_slot: employeeCount - 100,
                          };
                          if (periodicity === 'yearly') {
                            params.duration = periodicityDuration;
                          }
                          let searchParams = new URLSearchParams(params);
                          router.push(`/checkout/${slug}/?${searchParams}`);
                        } else {
                          let params: any = {
                            additional_employee_slot: employeeCount - 100,
                          };
                          if (periodicity === 'yearly') {
                            params.duration = periodicityDuration;
                          }
                          let searchParams = new URLSearchParams(params);
                          let redirectParams: any = {
                            redirect: `/checkout/${slug}/?${searchParams}`.toString(),
                          };
                          let redirectSearchParams = new URLSearchParams(redirectParams);
                          router.push(`/login?${redirectSearchParams}`);
                        }
                      }}
                    >
                      Unlock Premium Efficiency
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payroll Only */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hidden'>
              <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-6'>
                <h2 className='text-2xl font-bold mb-2'>YAHSHUA Payroll</h2>
                <p className='text-blue-100'>Automated Payroll Processing</p>
              </div>
              <div className='p-6'>
                <div className='text-center mb-6'>
                  <div className='flex items-baseline justify-center mb-2'>
                    <span className='text-4xl font-bold text-indigo-dye'>₱7,000</span>
                    <span className='text-lg text-gray-600 ml-2'>/month</span>
                  </div>
                  <p className='text-gray-600'>Up to 100 employees</p>
                </div>
                <ul className='space-y-3 mb-6'>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Automated Payroll Processing</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Tax Calculations & Compliance</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Benefits Management</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Payslip Generation</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-green-500 flex-shrink-0 mt-0.5' />
                    <span className='text-sm'>Government Reports (BIR, SSS, etc.)</span>
                  </li>
                </ul>
                <a
                  href='https://showcase.yahshuapayroll.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                >
                  Learn More
                  <ArrowTopRightOnSquareIcon className='w-4 h-4' />
                </a>
              </div>
            </div>

            {/* Bundle - Most Popular */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#FFC107] overflow-hidden relative hidden'>
              <div className='bg-gradient-to-r from-blue-500 via-blue-600 to-[#FFC107] text-white text-center py-6 pt-8'>
                <h2 className='text-2xl font-bold mb-2'>Complete Bundle</h2>
                <p className='text-blue-100'>YAHSHUA HRIS + YAHSHUA Payroll</p>
              </div>
              <div className='p-6'>
                <div className='text-center mb-6'>
                  <p className='text-sm text-amber-600 font-semibold mb-2'>Introductory Price</p>
                  <div className='flex items-baseline justify-center mb-2'>
                    <span className='text-4xl font-bold text-indigo-dye'>₱9,500</span>
                    <span className='text-lg text-gray-600 ml-2'>/month</span>
                  </div>
                  <div className='bg-green-50 border border-green-200 rounded-lg p-3 mb-4'>
                    <p className='text-green-800 font-medium text-sm mb-1'>Bundle Savings:</p>
                    <div className='text-xs text-green-700 space-y-1'>
                      <div className='flex justify-between'>
                        <span>YAHSHUA HRIS + Payroll:</span>
                        <span>₱11,000</span>
                      </div>
                      <div className='flex justify-between font-medium'>
                        <span>You save (15%):</span>
                        <span className='text-green-600'>₱1,500</span>
                      </div>
                    </div>
                  </div>
                  <p className='text-gray-600'>Up to 100 employees</p>
                </div>
                <ul className='space-y-2 mb-6 text-sm'>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                    <span>Everything in YAHSHUA HRIS</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                    <span>Complete YAHSHUA Payroll System</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                    <span>Seamless HRIS-Payroll Integration</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <CheckIcon className='w-4 h-4 text-green-500 flex-shrink-0 mt-0.5' />
                    <span>Priority Support</span>
                  </li>
                </ul>
                <a
                  href='https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Lq9wzoc89Sa_fVYXCXWkbS1MyNFXJTNKQtD_EfjnQ0Pyc5K5v7LpJ0u9fmTsXdOJ7yBUp1_JH'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block w-full bg-gradient-to-r from-blue-600 to-[#FFC107] hover:from-blue-700 hover:to-amber-600 text-white text-center px-6 py-3 rounded-lg font-bold transition-all shadow-lg'
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>

          {/* Legacy Single Card for More Details */}
          <div className='max-w-4xl mx-auto hidden'>
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden'>
              <div className='bg-gradient-to-r from-indigo-dye to-savoy-blue text-white text-center py-8'>
                <h2 className='text-3xl font-bold mb-2'>Complete HRIS Solution</h2>
                <p className='text-indigo-100'>Everything you need to manage your workforce</p>
              </div>

              <div className='p-8 md:p-12'>
                <div className='grid md:grid-cols-2 gap-12'>
                  {/* Pricing Details */}
                  <div>
                    <div className='mb-8'>
                      <p className='text-base text-amber-600 font-semibold mb-3'>Introductory Price</p>
                      <div className='flex items-baseline mb-4'>
                        <span className='text-5xl font-bold text-indigo-dye'>₱9,500</span>
                        <span className='text-xl text-gray-600 ml-2'>/month</span>
                      </div>
                      <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                        <p className='text-green-800 font-medium mb-2'>Bundle Savings Breakdown:</p>
                        <div className='text-sm text-green-700 space-y-1'>
                          <div className='flex justify-between'>
                            <span>YAHSHUA Payroll System:</span>
                            <span>₱7,000</span>
                          </div>
                          <div className='flex justify-between'>
                            <span>YAHSHUA HRIS System:</span>
                            <span>₱4,000</span>
                          </div>
                          <div className='flex justify-between border-t border-green-300 pt-1'>
                            <span>Subtotal:</span>
                            <span>₱11,000</span>
                          </div>
                          <div className='flex justify-between font-medium'>
                            <span>Bundle Discount (15%):</span>
                            <span className='text-green-600'>-₱1,500</span>
                          </div>
                          <div className='flex justify-between font-bold text-green-800 border-t border-green-300 pt-1'>
                            <span>Your Price:</span>
                            <span>₱9,500</span>
                          </div>
                        </div>
                      </div>
                      <p className='text-gray-600 mb-4'>
                        <strong>Covers up to 100 employees</strong>
                      </p>
                      <p className='text-sm text-gray-500'>
                        Additional employees beyond 100 are charged based on HRIS tiers (₱26-₱40 per employee)
                      </p>
                    </div>

                    <div className='space-y-6'>
                      <a
                        href='https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3Lq9wzoc89Sa_fVYXCXWkbS1MyNFXJTNKQtD_EfjnQ0Pyc5K5v7LpJ0u9fmTsXdOJ7yBUp1_JH'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block w-full bg-[#FFC107] hover:bg-amber-600 text-black text-center px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg'
                      >
                        Contact Sales
                      </a>
                    </div>
                  </div>

                  {/* Features List */}
                  <div>
                    <h3 className='text-2xl font-bold text-indigo-dye mb-6'>What's Included</h3>
                    <div className='space-y-4'>
                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <p className='text-gray-800 font-medium'>Complete YAHSHUA Payroll System</p>
                          </div>
                          <p className='text-gray-600 text-sm'>
                            Automated payroll processing, tax calculations, and compliance
                          </p>
                          <a
                            href='https://showcase.yahshuapayroll.com'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors mt-2'
                          >
                            Learn More
                            <ArrowTopRightOnSquareIcon className='w-3 h-3' />
                          </a>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>Full YAHSHUA HRIS Platform</p>
                          <p className='text-gray-600 text-sm'>Employee management, onboarding, and HR workflows</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>Job Posting & Recruitment</p>
                          <p className='text-gray-600 text-sm'>Post to multiple job boards with one click</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>Employee Self-Service Portal</p>
                          <p className='text-gray-600 text-sm'>
                            Let employees manage their own information and requests
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>Performance Management</p>
                          <p className='text-gray-600 text-sm'>Track employee performance and conduct evaluations</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>DOLE Compliance Reports</p>
                          <p className='text-gray-600 text-sm'>Automated government reporting and compliance</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>Document Management</p>
                          <p className='text-gray-600 text-sm'>Secure storage and management of HR documents</p>
                        </div>
                      </div>

                      <div className='flex items-start gap-3'>
                        <CheckIcon className='w-6 h-6 text-green-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-gray-800 font-medium'>Training & Development</p>
                          <p className='text-gray-600 text-sm'>Manage employee training programs and certifications</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Pricing Information */}
          <div className='max-w-4xl mx-auto mt-16'>
            <div className='bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-white/20'>
              <h3 className='text-2xl font-bold text-indigo-dye mb-2 text-center'>Additional Employee Pricing</h3>
              <p className='text-base text-amber-600 font-semibold mb-6 text-center'>Introductory Price</p>
              <div className='grid md:grid-cols-3 gap-6'>
                <div className='text-center p-6 bg-white/80 rounded-lg'>
                  <h4 className='font-bold text-indigo-dye mb-2'>101-250 Employees</h4>
                  <p className='text-2xl font-bold text-[#FFC107]'>₱39</p>
                  <p className='text-gray-600 text-sm'>per additional employee/month</p>
                </div>
                <div className='text-center p-6 bg-white/80 rounded-lg'>
                  <h4 className='font-bold text-indigo-dye mb-2'>251-500 Employees</h4>
                  <p className='text-2xl font-bold text-[#FFC107]'>₱37</p>
                  <p className='text-gray-600 text-sm'>per additional employee/month</p>
                </div>
                <div className='text-center p-6 bg-white/80 rounded-lg'>
                  <h4 className='font-bold text-indigo-dye mb-2'>500+ Employees</h4>
                  <p className='text-2xl font-bold text-[#FFC107]'>₱35</p>
                  <p className='text-gray-600 text-sm'>per additional employee/month</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          {/* <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-3xl font-bold text-indigo-dye mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-indigo-dye mb-2">Is there a setup fee?</h4>
                <p className="text-gray-600">No, there are no setup fees. You can start using the platform immediately after signing up.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-indigo-dye mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-indigo-dye mb-2">What happens if I exceed 100 employees?</h4>
                <p className="text-gray-600">Additional employees are automatically billed at the tier rates shown above. You'll be notified before any charges are applied.</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h4 className="font-bold text-indigo-dye mb-2">Do you offer custom enterprise solutions?</h4>
                <p className="text-gray-600">Yes, we offer custom pricing and features for large enterprises. Contact our sales team to discuss your specific needs.</p>
              </div>
            </div>
          </div> */}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PricingContent;
