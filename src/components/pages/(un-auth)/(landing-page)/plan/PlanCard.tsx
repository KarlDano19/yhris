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
  isAllowTrial,
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
  isAllowTrial: any;
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

  return (
    <div className='mt-12 mx-8'>
      <GradientBorderDiv>
        <ParentCardDiv className='py-4 px-3'>
          <div className='flex mx-1'>
            <div className='h-[65px]'>
              <img src={`/assets/bulb.png`} alt='bulb' />
            </div>
            <div className='ml-4 w-[14rem]'>
              <span className='text-[24px] mb-[0.5rem] leading-[1.2] font-bold'>{name}</span>
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
                      <img src={`/assets/check-icon.png`} alt='check-icon' />
                      <span className='ml-3 text-[13px]'>{feature}</span>
                    </PlanFeatureDiv>
                  )}
                  {index + 1 == features.length && (
                    <PlanFeatureDiv key={index} className='flex ml-2 mb-0'>
                      <img src={`/assets/check-icon.png`} alt='check-icon' />
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
            <img src={`/assets/toggle-icon.png`} width={30} alt='toggle-icon' />
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
                if (isAllowTrial) {
                  router.push('/register');
                } else {
                  let params: any = {
                    additional_employee_slot: addedSlots,
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
              }
            }}
          >
            {isAllowTrial ? 'Start Free Trial' : 'SUBSCRIBE'}
          </SubscribeBtn>
        </ParentCardDiv>
      </GradientBorderDiv>
    </div>
  );
};

export default PlanCard;
