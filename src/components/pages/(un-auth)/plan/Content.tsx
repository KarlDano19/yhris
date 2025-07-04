'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import classNames from '@/helpers/classNames';
import useGetPlanItems from './hooks/useGetPlanItems';

import PlanCard from './PlanCard';

const YearlyInput = styled.input`
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    opacity: 1 !important;
  }
`;
const Content = ({ isLoggedIn }: any) => {
  const [plans, SetPlans] = useState<any>([]);
  const [periodicity, setPeriodicity] = useState<any>('monthly');
  const [periodicityDuration, setPeriodicityDuration] = useState<any>(1);
  const { data, isLoading } = useGetPlanItems();

  useEffect(() => {
    if (data && !isLoading) {
      SetPlans(data);
    }
  }, [data]);

  const changePeriodicity = (periodicity: any) => {
    setPeriodicity(periodicity);
  };

  const showMore = (id: any) => {
    let newArray = [...plans];
    let index = newArray.findIndex((item: any) => item.id == id);
    let updatedObject = { ...newArray[index] };
    updatedObject.isShowMore = true;
    newArray[index] = updatedObject;
    SetPlans(newArray);
  };

  const renderPlans = () => {
    if (!plans || !plans.length) {
      return null;
    }
    return plans.map((item: any) => {
      return (
        <main key={item.id}>
          <PlanCard
            id={item.id}
            slug={item.slug}
            name={item.name}
            description={item.description}
            price={item.price}
            employeeSlots={item.min_employees}
            features={item.privilege_list}
            periodicity={periodicity}
            periodicityDuration={periodicityDuration}
            isShowMore={item.isShowMore}
            showMore={showMore}
            isLoggedIn={isLoggedIn}
            isAllowTrial={item.is_allow_trial}
          />
        </main>
      );
    });
  };

  return (
    <div className='relative h-screen'>
      <div className='py-12'>
        <div className='text-center mb-3'>
          <h1 className='font-bold text-[30px] leading-[39px] tracking-[0.02em] text-[#2c3f58]'>Subscription Plan</h1>
          <h5 className='mt-3 mb-8 text-[18px] leading-[23px] tracking-[0.02em] text-[#878787]'>
            Choose a plan that works best for you and your company.
          </h5>
        </div>
        <div className='text-center'>
          <div className='inline-block py-3 px-4 mx-auto bg-[#fbfcff]; border: 2px solid #e6eaf4; rounded-[10px];'>
            <div className='flex'>
              <div
                className={classNames(
                  periodicity === 'monthly' ? 'active-toggle-periodicity' : 'inactive-toggle-periodicity',
                  ''
                )}
                onClick={() => changePeriodicity('monthly')}
              >
                <div className='h-[37px] w-[65px] flex items-center justify-center'>Monthly</div>
              </div>
              <div
                className={classNames(
                  periodicity === 'yearly' ? 'active-toggle-periodicity' : 'inactive-toggle-periodicity',
                  ''
                )}
                onClick={() => changePeriodicity('yearly')}
              >
                <div
                  className={classNames(
                    'h-[37px] w-[65px] flex items-center justify-center',
                    periodicity === 'yearly' ? 'mr-4' : ''
                  )}
                >
                  Yearly
                </div>
                {periodicity === 'yearly' && (
                  <YearlyInput
                    type='number'
                    className='text-[black] text-[20px] w-[6rem] text-center border-0 rounded-[5px] py-2 px-2 font-semibold'
                    value={periodicityDuration}
                    onChange={({ target }) => {
                      let value = parseInt(target.value);
                      if (isNaN(value) || value < 1) {
                        setPeriodicityDuration(1);
                      } else {
                        setPeriodicityDuration(parseInt(target.value));
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center flex-sm-wrap'>{renderPlans()}</div>
      </div>
      <div className='absolute top-[2.7rem] z-[-1]'>
        <img src={`/assets/turning-globe.png`} alt='turning-globe' />
      </div>
      <div className='absolute right-0 bottom-[-44px] z-[-1] flex'>
        <img src={`/assets/rocket-fly.png`} alt='rocket-fly' />
      </div>
    </div>
  );
};

export default Content;
