// Login.tsx
"use client";
import React, { FormEvent } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { Library, library } from "@fortawesome/fontawesome-svg-core";
import imageToAdd from "./../assets/images/logo.png";
import { Button, Checkbox, Form, Input } from "antd";
import { BiEnvelope, BiLock } from "react-icons/bi";
export default function Login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [modalIsOpen, setModalIsOpen] = useState(false); // define modalIsOpen and setModalIsOpen
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting form...");
    setModalIsOpen(true); // open the modal on form submission
  };
  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const { email, password } = formData;

  return (
    <>
      {/* <section className=" container min-h-screen flex items-center justify-center"> */}
      <div
        className="flex rounded-2xl items-center"
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          left: "0px",
          bottom: "0px",
          padding: "0px",
        }}
      >
        <div
          className="md:w-1 md:px-16"
          style={{ margin: "70px", width: "35%" }}
        >
          <p
            className=" text"
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              marginLeft: "115px",
              fontStyle: "normal",
              fontWeight: "700",
              fontSize: "45px",
              top: "160px",
              color: "#2C3F58",
              fontFamily: "Golo Text",
              width: "371px",
              height: "54px",
              lineHeight: "5rem",
            }}
          >
            Welcome back!
          </p>
          <p
            className="text-[rgba(111,130,155,1)]"
            style={{
              position: "absolute",
              fontFamily: "Golos Text",
              margin: "10px",
              width: "370px",
              height: "35px",
              fontStyle: "normal",
              fontWeight: "400",
              fontSize: "15px",
              lineHeight: "18px",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              letterSpacing: "0.02em",
              top: "210px",
              left: "250px",
            }}
          >
            Start managing your people faster and better
          </p>
          <form
            onSubmit={handleSubmit}
            action=""
            className="flex flex-col gap-2"
          >
            <div className="relative">
              <Input size="large" placeholder="Email" prefix={<BiEnvelope style={{color:'#355FD0'}} />} />
            </div>
            <div className="relative">
              <Input size="large" placeholder="password" prefix={<BiLock  style={{color:'#355FD0'}}/>} />
            </div>
            <div
              className=" border-[#002D74] "
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1px ",
                color: "rgba(53, 95, 208, 1)",
                fontStyle: "normal",
                fontWeight: "400",
              }}
            >
              <a href="/forget-password">
                <b>Forgot password?</b>
              </a>
            </div>
            <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300" style={{cursor:'pointer'}}>
             <a href="/setup-company-profile"> Sign In</a>
            </button>
            <div
              className="footer"
              style={{
                fontFamily: "Golos Text",
                fontStyle: "normal",
                fontWeight: "400",
                fontSize: "15px",
                lineHeight: "18px",
                textAlign: "center",
                letterSpacing: "0.02em",
                color: "#2C3F58",
              }}
            >
              <p>
                Don't have an account?
                <b style={{ color: "rgba(53, 95, 208, 1)" }}><a href="/create-account">Sign Up here</a></b>
              </p>
            </div>
          </form>
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400"></hr>
            <p className="text-center text-sm">or</p>
            <hr className="border-gray-400"></hr>
          </div>

          <div
            className="buttons w-full"
            style={{ display: "flex", flexDirection: "row", gap: "115px" }}
          >
            <button
              className="bg-white border py-2 w-full  mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#2C3F58]"
              style={{
                border: "1px solid #ACB9CB",
                borderRadius: "5px",
                width: "200px",
                height: "45px",
              }}
            >
              <svg
                className="mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="25px"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Google
            </button>
            <button
              className="bg-white border py-2 w-full  mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#2C3F58]"
              style={{
                border: "1px solid #ACB9CB",
                borderRadius: "5px",
                width: "200px",
                height: "45px",
              }}
            >
              <svg
                className="mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="25px"
              >
                <path
                  fill="#3b5998"
                  d="M22.5,0H1.5C0.673,0,0,0.673,0,1.5v21c0,0.827,0.673,1.5,1.5,1.5h10.73v-8.823H9.81v-3.431h2.42v-2.576c0-2.396,1.465-3.695,3.586-3.695c0.981,0,1.821,0.073,2.065,0.105v2.494l-1.414,0.002c-1.112,0-1.327,0.529-1.327,1.301v1.704h2.647l-0.346,3.43h-2.301v8.823h4.499c0.827,0,1.5-0.673,1.5-1.5V1.5C24,0.673,23.327,0,22.5,0z"
                />
              </svg>
              Facebook
            </button>
          </div>
          <div
            className="privacyNotice"
            style={{
              fontStyle: "normal",
              marginTop: "1rem",
              fontWeight: "400",
              fontSize: "15px",
              textAlign: "center",
              lineHeight: "18px",
              alignItems: "center",
              letterSpacing: "0.02em",
              textDecorationLine: "underline",
              color: "#2C3F58",
            }}
          >
            Privacy Notice
          </div>
        </div>

        <div style={{ position: "absolute", right: "0px", height: "100%" }}>
          <img src="image1.png" style={{ height: "100%" }} />
        </div>
      </div>

     
    </>
  );
}
