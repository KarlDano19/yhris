"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Modal from "react-modal";
import AiOutlineMail from "react-icons/fa";
import Icon from "@ant-design/icons/lib/components/Icon";
import { MailOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";

const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
  });
  const { password1, password2 } = formData;
  const [modalIsOpen, setModalIsOpen] = useState(false); // define modalIsOpen and setModalIsOpen
  // const handleModal = () => {
  //     setModalIsOpen(!modalIsOpen);
  // }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting form...");
    setModalIsOpen(true); // open the modal on form submission
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {/* <section className="min-h-screen flex items-center justify-center"> */}
        <div className="flex rounded-2xl items-center" style={{position:"absolute", top:"0px", right:"0px", left:"0px", bottom:"0px", padding:"0px"}}>
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[rgb(72,61,139)]">
              Change Your Password
            </h2>
            <p className="text-xs mt-4 text-[rgb(169,169,169)]">
              Please make sure your password contains one lowercase letter,one
              number and atleast 6 character long
            </p>
            <form
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col gap-4"
            >
              <Form.Item
                name="password"
                initialValue={password1}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="New Password" />
              </Form.Item>

              <Form.Item
                name="password"
                initialValue={password2}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <button
                className="bg-[rgb(65,105,225)] rounded-xl text-white py-2 hover:scale-105 duration-300"
                type="submit"
              >
                Change Password
              </button>
              <div className="text-[rgb(65,105,225)]">
                <a href="/login" className="text-[rgb(65,105,225)]">
                  Back to Sign In
                </a>
              </div>
            </form>
            {/* <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                            <div></div>
                        </div> */}
          </div>
          <div style={{position:"absolute", right:"0px", height:"100%"}} >
            <img src="image1.png" style={{height:"100%"}} />
          </div>
        </div>
      {/* </section> */}
      {/* <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
    <div className="popupModal flex flex-col items-center justify-center" style={{ width: "70%", height: "50%" }}>
        <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="font-bold text-2xl text-[rgb(72,61,139)]">Instructions Sent</h1>
            <div className="flex items-center justify-center bg-blue-700 rounded-full w-16 h-16 mb-4">
                <MailOutlined className="text-white text-4xl" />
            </div>
            <p className="text-gray-600 text-center flex-grow">We have sent instructions to change your password to <div style={{color:'blue'}}></div>.<br></br>
               Please check your inbox or spam folder.<br></br>
               Thank you and GOD bless!
            </p>
        </div>
        <button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded" onClick={() => setModalIsOpen(false)}>Change Password</button>
    </div>
</Modal> */}
    </>
  );
};

export default ChangePassword;
