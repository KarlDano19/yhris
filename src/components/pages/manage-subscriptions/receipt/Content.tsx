'use client';

import React, { useState, useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import useGetReceiptDetail from './hooks/useGetReceiptDetail';

const Content = () => {
  const { reference_id }: any = useParams();
  const router = useRouter();
  const [receipt, setReceipt] = useState<any>({});
  const { data, isLoading } = useGetReceiptDetail(reference_id);

  useEffect(() => {
    if (data && Object.keys(data).length && !isLoading) {
      setReceipt(data);
    }
  }, [data]);

  return (
    <main>
      <div style={{ margin: '10px' }}>
        <button
          className='h-[53px] rounded-[10px] bg-[#2757ed] text-white font-bold text-[15px] px-[20px] py-[10px] hover:bg-[#4f80ff]'
          onClick={() => {
            router.back();
          }}
        >
          Back
        </button>
      </div>
      <div
        style={{
          background: "url('https://storage.googleapis.com/yahshuapayroll.com/image/receipt_background.png')",
          backgroundRepeat: 'no-repeat',
          height: '950px',
          maxWidth: '600px',
          margin: '0 auto',
          backgroundSize: '100% 100%',
          scale: '0.9',
        }}
      >
        <div
          style={{
            minWidth: '300px',
            maxWidth: '430px',
            margin: '0 auto',
            paddingTop: '11rem',
          }}
        >
          <div
            style={{
              borderRadius: '25px',
              font: '15px/20px DM Sans, Arial, sans-serif',
              background: 'url(https://storage.googleapis.com/yahshuapayroll.com/image/zigzag_border.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '100% 100%',
            }}
          >
            <div style={{ padding: '18px 30px 0 30px' }}>
              <div style={{ textAlign: 'center' }}>
                <p className='text-[15px]'>Hey, {receipt?.name}!</p>
                <p className='text-[#727272] text-[13px]'>Thank you for choosing YAHSHUA Payroll Solutions.</p>
              </div>
              <div style={{ paddingTop: '6px' }}>
                <div style={{ display: 'inline-block', marginRight: '8px' }}>
                  <img src='https://storage.googleapis.com/yahshuapayroll.com/image/rocket.png' />
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginTop: '8px',
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 700 }}>{receipt?.plan_name}</div>
                  <p
                    style={{
                      fontSize: '10px',
                      lineHeight: '0.8rem',
                      marginBottom: '6px',
                    }}
                  >
                    Number of Employees: {receipt?.employees}
                    <br />
                    Lock-in Period: {receipt?.periodicity}
                  </p>
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
                      <td style={{ textAlign: 'end', padding: '5px 0' }}>PHP {receipt?.subtotal}</td>
                    </tr>
                    {!!receipt?.discount && (
                      <>
                        <tr>
                          <td style={{ padding: '5px 0' }}>Discount %</td>
                          <td style={{ textAlign: 'end', padding: '5px 0' }}>{receipt?.discount}%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 0' }}>Discount</td>
                          <td style={{ textAlign: 'end', padding: '5px 0' }}>PHP {receipt?.discounted_amount}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '5px 0' }}>Net Discount</td>
                          <td style={{ textAlign: 'end', padding: '5px 0' }}>PHP {receipt?.net_discounted_amount}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td style={{ padding: '5px 0' }}>VAT (12%)</td>
                      <td style={{ textAlign: 'end', padding: '5px 0' }}>PHP {receipt?.vat_amount}</td>
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
                        PHP {receipt?.total_amount}
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
                  <p>Ref. No. {receipt?.reference_id}</p>
                  <p className='mt-4'>{receipt?.purchase_date}</p>
                </div>
                {!!receipt?.discount && <div style={{ height: '80px' }}></div>}
                {!!!receipt?.discount && <div style={{ height: '60px' }}></div>}
              </div>
            </div>
          </div>
          <br />
          <div
            style={{
              textAlign: 'center',
              paddingTop: '5px',
              font: '15px/20px DM Sans, Arial, sans-serif',
            }}
          >
            <p style={{ color: '#ffffff' }}>
              <b>Need help?</b>
              <br />
              If you did not make this request,
              <br />
              please visit our
              <a style={{ color: '#ffffff' }} href='https://showcase.yahshuapayroll.com/help-center'>
                Help Center
              </a>
              <br />
              <br />
            </p>
            <div
              style={{
                background: 'linear-gradient(90deg,#dce6ff 0%,#9fb8f9 55.21%,#2757ed 100%)',
                height: '5px',
                borderRadius: '12px',
                width: '85%',
                margin: '0 auto 0 auto',
              }}
            ></div>
            <p style={{ textAlign: 'center', color: '#ffffff' }}>
              <b>Follow us</b>
            </p>
            <div>
              <button style={{ border: 'none', backgroundColor: 'transparent' }}>
                <a href='https://www.facebook.com/yposolutions'>
                  <img src='https://storage.googleapis.com/yahshuapayroll.com/image/email_facebook_white_icon.png' />
                </a>
              </button>
              <button style={{ border: 'none', backgroundColor: 'transparent' }}>
                <a href='https://www.instagram.com/yposolutions/'>
                  <img src='https://storage.googleapis.com/yahshuapayroll.com/image/email_instagram_white_icon.png' />
                </a>
              </button>
              <button style={{ border: 'none', backgroundColor: 'transparent' }}>
                <a href='https://www.linkedin.com/company/yahshuapayroll/'>
                  <img src='https://storage.googleapis.com/yahshuapayroll.com/image/email_linked_in_white_icon.png' />
                </a>
              </button>
              <button style={{ border: 'none', backgroundColor: 'transparent' }}>
                <a href='https://www.youtube.com/channel/UC-3AcnpT_3NUnKdhm-ASMJA'>
                  <img src='https://storage.googleapis.com/yahshuapayroll.com/image/email_youtube_white_icon.png' />
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Content;
