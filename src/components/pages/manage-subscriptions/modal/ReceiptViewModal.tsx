import { Dispatch, useRef, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

type ReceiptViewModalProps = {
  receiptDetailData: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean | null>;
};

const ReceiptViewModal: React.FC<ReceiptViewModalProps> = ({ receiptDetailData, isOpen, setIsOpen }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen ? true : false} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(null)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Receipt - {receiptDetailData?.reference_id}</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(null)} />
                </div>
                <div
                  style={{
                    margin: '0 auto',
                    scale: '0.9',
                  }}
                >
                  <div
                    style={{
                      minWidth: '300px',
                      maxWidth: '430px',
                      margin: '0 auto',
                      paddingTop: 'rem',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: '25px',
                        font: '15px/20px DM Sans, Arial, sans-serif',
                        background: 'url(/assets/zigzag-border.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                      }}
                    >
                      <div style={{ padding: '18px 30px 0 30px' }}>
                        <div className='flex flex-col items-center' style={{ paddingTop: '6px' }}>
                          <div className='mb-3' style={{ marginRight: '8px' }}>
                            <img src='/assets/bulb.png' />
                          </div>
                          <div
                            className='text-center'
                            style={{
                              verticalAlign: 'top',
                              marginTop: '8px',
                            }}
                          >
                            <p className='mb-2' style={{ fontSize: '20px', fontWeight: 700 }}>
                              {receiptDetailData?.plan_name}
                            </p>
                            <p
                              style={{
                                marginBottom: '6px',
                              }}
                            >
                              Number of Employees: {receiptDetailData?.employees}
                            </p>
                            <p>Lock-in Period: {receiptDetailData?.periodicity}</p>
                          </div>
                        </div>
                        <hr
                          style={{
                            margin: '16px 0',
                            borderColor: '#C2C2C2',
                            borderBottomWidth: '0 !important',
                          }}
                        />
                        <div>
                          <table style={{ width: '100%' }}>
                            <tbody>
                              <tr>
                                <td style={{ padding: '5px 0' }}>Subtotal</td>
                                <td style={{ textAlign: 'end', padding: '5px 0' }}>
                                  PHP {receiptDetailData?.subtotal}
                                </td>
                              </tr>
                              {!!receiptDetailData?.discount && (
                                <>
                                  <tr>
                                    <td style={{ padding: '5px 0' }}>Discount %</td>
                                    <td style={{ textAlign: 'end', padding: '5px 0' }}>
                                      {receiptDetailData?.discount}%
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '5px 0' }}>Discount</td>
                                    <td style={{ textAlign: 'end', padding: '5px 0' }}>
                                      PHP {receiptDetailData?.discounted_amount}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '5px 0' }}>Net Discount</td>
                                    <td style={{ textAlign: 'end', padding: '5px 0' }}>
                                      PHP {receiptDetailData?.net_discounted_amount}
                                    </td>
                                  </tr>
                                </>
                              )}
                              <tr>
                                <td style={{ padding: '5px 0' }}>VAT (12%)</td>
                                <td style={{ textAlign: 'end', padding: '5px 0' }}>
                                  PHP {receiptDetailData?.vat_amount}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    padding: '5px 0',
                                    fontWeight: 700,
                                    color: '#2757ed',
                                  }}
                                >
                                  Total
                                </td>
                                <td
                                  style={{
                                    textAlign: 'end',
                                    padding: '5px 0',
                                    fontWeight: 700,
                                    color: '#2757ed',
                                  }}
                                >
                                  PHP {receiptDetailData?.total_amount}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <hr
                            style={{
                              margin: '16px 0 24px 0',
                              borderColor: '#DDDDDD',
                              borderBottomWidth: '0 !important',
                            }}
                          />
                          <div
                            style={{
                              textAlign: 'center',
                              lineHeight: '0.5rem',
                              color: '#878787',
                            }}
                          >
                            <p>Ref. No. {receiptDetailData?.reference_id}</p>
                            <p className='mt-4'>{receiptDetailData?.purchase_date}</p>
                          </div>
                          {!!receiptDetailData?.discount && <div style={{ height: '80px' }}></div>}
                          {!!!receiptDetailData?.discount && <div style={{ height: '60px' }}></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReceiptViewModal;
