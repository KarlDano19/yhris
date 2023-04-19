'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Modal  from 'react-modal';
import AiOutlineMail  from "react-icons/fa";
import Icon from '@ant-design/icons/lib/components/Icon';
import { MailOutlined } from '@ant-design/icons';

const ForgetPassword: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
    });
    const [modalIsOpen, setModalIsOpen] = useState(false); // define modalIsOpen and setModalIsOpen
    const handleModal = () => {
        setModalIsOpen(!modalIsOpen);
    }
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Submitting form...');
        setModalIsOpen(true); // open the modal on form submission
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const { email } = formData;

    return (
        <>
            <section className="min-h-screen flex items-center justify-center">
                <div className="flex rounded-2xl shadow-lg max-w-screen-80 p-5 items-center">
                    <div className="md:w-1/2 px-8 md:px-16">
                        <h2 className="font-bold text-2xl text-[rgb(72,61,139)]">Forget your password?</h2>
                        <p className="text-xs mt-4 text-[rgb(169,169,169)]">Enter your email below and we'll send you a link to reset your password </p>
                        <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
                            <input
                                type="email"
                                className="p-2 mt-8 rounded-xl border"
                                name="email"
                                onChange={handleInputChange}
                                value={email}
                                required
                                placeholder="Email"
                            />
                            <button className="bg-[rgb(65,105,225)] rounded-xl text-white py-2 hover:scale-105 duration-300" type='submit' >Submit</button>
                            <div className="text-[rgb(65,105,225)]"><a href='/login' className='text-[rgb(65,105,225)]'>Back to Sign In</a></div>
                        </form>
                        <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                            <div></div>
                        </div>
                    </div>
                    <div className="md:block hidden w-1/2">
                        <img src="image1.png" className="rounded-2xl" />
                    </div>
                </div>
            </section>
            <Modal 
  isOpen={modalIsOpen} 
  style={{
    overlay:  {
      width: "30%",
      height: "50%",
      textAlign: "center",
      alignItems:'center',
      position: 'absolute',
      top:'50%',
      left:'50%',
      transform:'translate(-50%,-50%)',
      padding:'0',
      outline: 'none',
      boxShadow: 'none',
    },content:{
        backgroundColor:'none'
    }
  }} 
  onRequestClose={() => setModalIsOpen(false)}
>
  <div className="popupModal flex flex-col items-center justify-center" >
    <div className="flex flex-col items-center justify-center mb-4">
      <h1 className="font-bold text-2xl text-[rgb(72,61,139)]">Instructions Sent</h1>
      <div className="flex items-center justify-center bg-blue-700 rounded-full w-16 h-16 mb-4">
        <MailOutlined className="text-white text-4xl" />
      </div>
      <p className="text-gray-600 text-center flex-grow">
        We have sent instructions to change your password to <div style={{color:'blue'}}>{email}</div>.<br></br>
        Please check your inbox or spam folder.<br></br>
        Thank you and GOD bless!
      </p>
      <button className="bg-blue-700 hover:bg-[#355FD0] text-[#FFFFFF] py-2 px-4 rounded" onClick={() => setModalIsOpen(false)} style={{width:'100%',margin:'2rem 0rem',borderRadius:'5px'}}>
        <b>Okay</b>
      </button>
    </div>
  </div>
</Modal>


        </>
    );
};

export default ForgetPassword;
