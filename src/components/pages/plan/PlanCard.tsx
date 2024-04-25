import React, { useState } from 'react';

import { redirect, useRouter } from 'next/navigation';

import styled from 'styled-components';

import classNames from '@/helpers/classNames';
import formatPrice from '@/helpers/currencyFormat';

const GradientBorderDiv = styled.div`
  background: linear-gradient(180deg, #2757ed 0%, rgba(148, 215, 255, 0.3) 100%);
  width: 350px;
  box-shadow: 0px 0px 10px rgba(4, 33, 123, 0.1);
  border-radius: 10px;
  padding: 1px;
`;
const ParentCardDiv = styled.div`
  background: #ffffff;
  border-radius: 10px;
`;
const SeparatorDiv = styled.div`
  border-top: 1px solid #878787;
  margin-bottom: 1rem;
`;
const PlanNameHeader = styled.h2`
  font-weight: 700;
`;
const PlanFeaturesDiv = styled.div`
  height: 85px;
  overflow: hidden;
`;
const CustomMoreDiv = styled.div`
  height: 19px;

  button {
    background: transparent;
    border: 0;
    padding: 0;
    margin-left: 0.5rem !important;
    cursor: pointer;
    color: #2757ed;
  }
`;
const PlanFeatureDiv = styled.div`
  margin-bottom: 0.8rem;
`;
const PlanPriceSpan = styled.span`
  font-weight: 700;
  font-size: 25px;
  line-height: 33px;
  letter-spacing: 0.02em;
  color: #2757ed;
`;
const PlanPeriodicitySpan = styled.span`
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.3px;
  color: #2757ed;
`;
const EmployeeSlotLabel = styled.label`
  font-size: 15px;
  letter-spacing: 0.3px;
  font-weight: 400;
  margin-bottom: 3px;
`;
const EmployeeSlotInput = styled.input`
  font-size: 15px;
  border-radius: 5px;
  padding: 5px;
  font-weight: 500;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    opacity: 1 !important;
  }
`;
const VatLabel = styled.div`
  color: #acacab;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.26px;
`;
const SubscribeBtn = styled.button`
  height: 53px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const PlanCard = ({
  id,
  slug,
  name,
  description,
  price,
  employeeSlots,
  features,
  periodicity,
  periodicityDuration,
  isShowMore,
  showMore,
  isLoggedIn,
}: {
  id: any;
  slug: any;
  name: any;
  description: any;
  price: any;
  employeeSlots: any;
  features: any;
  periodicity: any;
  periodicityDuration: any;
  isShowMore: any;
  showMore: any;
  isLoggedIn: any;
}) => {
  const router = useRouter();
  const [addedSlots, setAddedSlots] = useState(0);
  const [totalSlots, setTotalSlots] = useState(employeeSlots);
  const [isError, setIsError] = useState(false);

  const renderPeriodicity = () => {
    let label = 'month';
    if (periodicity === 'yearly') {
      label = 'year';
      if (periodicityDuration > 1) {
        label = `${periodicityDuration} years`;
      }
    }
    return label;
  };

  const periodicityPrice = () => {
    if (isNaN(addedSlots)) {
      return price;
    }
    let customPrice = price + addedSlots * 60;
    if (periodicity === 'yearly') {
      customPrice = customPrice * 12 * periodicityDuration;
    }
    return customPrice;
  };

  const PlanLogo = () => {
    return (
      <svg width='76' height='82' viewBox='0 0 76 82' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect width='76' height='82' rx='10' fill='#4F80FF' />
        <path
          d='M32 59C32 60.1 32.9 61 34 61H42C43.1 61 44 60.1 44 59V57H32V59ZM38 21C30.28 21 24 27.28 24 35C24 39.76 26.38 43.94 30 46.48V51C30 52.1 30.9 53 32 53H44C45.1 53 46 52.1 46 51V46.48C49.62 43.94 52 39.76 52 35C52 27.28 45.72 21 38 21ZM43.7 43.2L42 44.4V49H34V44.4L32.3 43.2C29.6 41.32 28 38.26 28 35C28 29.48 32.48 25 38 25C43.52 25 48 29.48 48 35C48 38.26 46.4 41.32 43.7 43.2Z'
          fill='white'
        />
      </svg>
    );
  };

  return (
    <div className='mt-12 mx-8'>
      <GradientBorderDiv>
        <ParentCardDiv className='py-4 px-3'>
          <div className='flex mx-1'>
            <div>
              <PlanLogo />
            </div>
            <div className='mx-4'>
              <PlanNameHeader className='text-[24px] mb-[0.5rem] leading-[1.2]'>{name}</PlanNameHeader>
              <p className='text-[13px] mb-[1rem]'>{description}</p>
            </div>
          </div>
          <SeparatorDiv />
          <PlanFeaturesDiv className={classNames(isShowMore ? 'remove-height' : '', '')}>
            {features.map((feature: any, index: any) => {
              return (
                <main key={index}>
                  {index + 1 != features.length && (
                    <PlanFeatureDiv key={index} className='flex ml-2'>
                      <img src={`${process.env.NEXT_PUBLIC_IMG_URL}/static/assets/check-icon.png`} alt='check-icon' />
                      <span className='ml-3 text-[13px]'>{feature}</span>
                    </PlanFeatureDiv>
                  )}
                  {index + 1 == features.length && (
                    <PlanFeatureDiv key={index} className='flex ml-2 mb-0'>
                      <img src={`${process.env.NEXT_PUBLIC_IMG_URL}/static/assets/check-icon.png`} alt='check-icon' />
                      <span className='ml-3 text-[13px]'>{feature}</span>
                    </PlanFeatureDiv>
                  )}
                </main>
              );
            })}
          </PlanFeaturesDiv>
          <CustomMoreDiv className='mt-1 mb-1'>
            {features.length > 3 && !isShowMore && (
              <button
                type='button'
                onClick={() => {
                  showMore(id);
                }}
              >
                more...
              </button>
            )}
          </CustomMoreDiv>
          <div className='mb-[1rem]'>
            <EmployeeSlotLabel htmlFor='number_of_employees'>Number of employees</EmployeeSlotLabel>
            <EmployeeSlotInput
              id='number_of_employees'
              type='number'
              className={classNames(
                isError ? 'border-red-500' : '',
                'bg-gray-50 border border-gray-300 text-gray-900 pl-11 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
              )}
              placeholder={employeeSlots}
              value={totalSlots}
              onChange={({ target }) => {
                let value = parseInt(target.value);
                if (value < employeeSlots) {
                  setIsError(true);
                  setTotalSlots(value);
                  setAddedSlots(0);
                } else {
                  if (!isNaN(value)) {
                    setIsError(false);
                  }
                  setTotalSlots(value);
                  setAddedSlots(value - employeeSlots);
                }
              }}
            />
          </div>
          <div className='text-center'>
            <PlanPriceSpan>PHP {formatPrice(periodicityPrice())}</PlanPriceSpan>
            <PlanPeriodicitySpan>/{renderPeriodicity()}</PlanPeriodicitySpan>
          </div>
          <VatLabel className='flex justify-center align-items-center pt-2 pb-8'>
            <img
              src={`${process.env.NEXT_PUBLIC_IMG_URL}/static/assets/toggle-icon.png`}
              width={30}
              alt='toggle-icon'
            />
            <span className='pl-2'>*VAT Exclusive</span>
          </VatLabel>
          <SubscribeBtn
            type='button'
            className='w-full uppercase text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center'
            disabled={isError}
            onClick={() => {
              if (isLoggedIn) {
                let params: any = {
                  additional_employee_slot: addedSlots,
                };
                if (periodicity === 'yearly') {
                  params.duration = periodicityDuration;
                }
                let searchParams = new URLSearchParams(params);
                router.push(`/checkout/${slug}/?${searchParams}`);
              } else {
                let params: any = {
                  additional_employee_slot: addedSlots,
                };
                if (periodicity === 'yearly') {
                  params.duration = periodicityDuration;
                }
                let searchParams = new URLSearchParams(params);
                let redirectParams: any = {
                  redirect: (`/checkout/${slug}/?${searchParams}`).toString(),
                }
                let redirectSearchParams = new URLSearchParams(redirectParams);
                router.push(`/login?${redirectSearchParams}`);
              }
            }}
          >
            SUBSCRIBE
          </SubscribeBtn>
        </ParentCardDiv>
      </GradientBorderDiv>
    </div>
  );
};

export default PlanCard;
