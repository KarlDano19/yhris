// Register.tsx
"use client";
import React from "react";
import { useState } from "react";
import { LinkOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
} from "antd";
import Link from "next/link";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const { name, email, password, password2 } = formData;

  return (
    <>
      <></>
      {/* <section className=" min-h-screen flex items-center justify-center"> */}
        <div className="flex rounded-2xl items-center" style={{position:"absolute", top:"0px", right:"0px", left:"0px", bottom:"0px", padding:"0px"}}>
          <div className="md:w-1/2 px-8 md:px-16">
            <h2 className="font-bold text-2xl text-[rgb(72,61,139)]">
              Create Account{" "}
            </h2>
            <form action="" className="flex flex-col gap-4">
              Register As
              <Form.Item>
                <Select>
                  <Select.Option value="demo">Employer</Select.Option>
                  <Select.Option value="">Fresher</Select.Option>
                </Select>
              </Form.Item>
              Name
              <Form.Item>
                <Input />
              </Form.Item>
              Email Address
              <Form.Item
                name={["user", "email"]}
                rules={[{ type: "email" }]}
                initialValue={email}
              >
                <Input />
              </Form.Item>
              Password
              <Form.Item
                name="password"
                initialValue={password}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              Confirm Password
              <Form.Item
                name="password"
                initialValue={password}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
              <button className="bg-[rgb(65,105,225)] rounded-xl text-white py-2 hover:scale-105 duration-300">
                Sign Up
              </button>
            </form>
            <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
              <div>
                <Form.Item valuePropName="checked" required>
                  <Checkbox>
                    I have read and agree with
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline mr-2"
                    >
                      Terms of Service
                    </a>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline mr-2"
                    >
                      Privacy Notice
                    </a>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Personal Data Collection and Disclosure Policy
                    </a>
                  </Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>

          <div style={{position:"absolute", right:"0px", height:"100%"}}>
            <img src="image1.png" style={{height:"100%"}} />
          </div>
        </div>
      {/* </section> */}
    </>
  );
};

export default Register;
