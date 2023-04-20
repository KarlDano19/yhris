// Login.tsx
'use client';
import React, { FormEvent } from 'react';
import Modal from 'react-modal';
import { useState } from 'react';
import imageToAdd from "./../assets/images/logo.png";
import { Button, Checkbox, Form, Input } from 'antd';
export default function Login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

 
  const [modalIsOpen, setModalIsOpen] = useState(false); // define modalIsOpen and setModalIsOpen
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting form...');
    setModalIsOpen(true); // open the modal on form submission
};
const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
}

  const { email, password } = formData;

  return (
    <>
      <section className=" min-h-screen flex items-center justify-center" >
        <div className="flex rounded-2xl shadow-lg max-w-screen-80 p-5 items-center">
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[rgb(72,61,139)]">Welcome Back </h2>
            <p className="text-xs mt-4 text-[rgb(169,169,169)]" >Start managing your people faster and better</p>

            <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
              <input type="email" className="p-2 mt-8 rounded-xl border"  name="email" onChange={handleInputChange} value={email} required placeholder="Email" />
              <div className="relative">
              <Form.Item
  className="p-2 rounded-xl border w-full"
  name="password"
  initialValue={password}
  rules={[{ required: true, message: 'Please input your password!' }]}
>
  <Input.Password placeholder="Password" />
</Form.Item>
              </div>
              <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300">Sign In</button>
              <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
              <a href="#">Forgot your password?</a>
            </div>
            </form>
            <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
              <hr className="border-gray-400"></hr>
              <p className="text-center text-sm">OR</p>
              <hr className="border-gray-400"></hr>
            </div>

            <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Login with Google
            </button>
            <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#3b5998]">
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25px">
                <path fill="#3b5998" d="M22.5,0H1.5C0.673,0,0,0.673,0,1.5v21c0,0.827,0.673,1.5,1.5,1.5h10.73v-8.823H9.81v-3.431h2.42v-2.576c0-2.396,1.465-3.695,3.586-3.695c0.981,0,1.821,0.073,2.065,0.105v2.494l-1.414,0.002c-1.112,0-1.327,0.529-1.327,1.301v1.704h2.647l-0.346,3.43h-2.301v8.823h4.499c0.827,0,1.5-0.673,1.5-1.5V1.5C24,0.673,23.327,0,22.5,0z" />
              </svg>
              Login with Facebook
            </button>
            <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
              <p>Don't have an account?</p>
              <button  className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"><a href='/register'>Register</a></button>
            </div>
          </div>

          <div className="md:block hidden w-1/2">
            <img src="image1.png" className="rounded-2xl" />
          </div>
        </div>
      </section>

      <Modal isOpen={modalIsOpen} style={{
                overlay: {
                    borderRadius: '50px',
                    width: '515px',
                    height: '502px',
                    textAlign: "center",
                    alignItems: 'center',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    padding: '10px',
                    outline: 'none',
                    boxShadow: 'none',
                }, content: {
                    backgroundColor: 'none'
                }
            }} onRequestClose={() => setModalIsOpen(false)}>
                <div className="popupModal flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="flex items-center justify-center rounded-full mb-4">
                            <img src='welcomeEmoji.png' style={{ width: '113px', height: '113px' }} />
                        </div>
                        <br />
                        <h1 className="font-bold text-2xl text-[#4CAF50]">Welcome to YAHSHUA HRIS</h1>
                        <br />
                        <p className="text-[#2C3F58] text-center flex-grow" style={{ paddingBottom: '50px' }}><b>I am your help in managing your people.</b>Are you ready to transform your team?</p>
                        <button className="bg-blue-700 hover:bg-[#355FD0] text-[#FFFFFF] py-2 px-4 rounded" style={{ width: '85%', position: 'absolute', bottom: 5, margin: '2rem 0rem', borderRadius: '5px' }} onClick={() => setModalIsOpen(false)}>YES, LET'S GO</button>
                    </div>
                </div>

            </Modal>


    </>
  );
};


