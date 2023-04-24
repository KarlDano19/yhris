"use client";
import { Button, Form, Input, Select } from "antd";
import Header2 from "../../header2/page"
import React, { FormEvent, useState } from 'react'
import Modal from "react-modal";
function postJob() {
    const [modalIsOpen, setModalIsOpen] = useState(true); // define modalIsOpen and setModalIsOpen
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting form...");
        setModalIsOpen(true); // open the modal on form submission
      };

  return (
    <> 
    <Header2></Header2>
       <div className="dashBody">
          <h1 style={{marginTop:'2rem',marginLeft:'5.3rem'}}>Post a Job</h1>
          <div
          className="upperDashboard"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            marginLeft:'50px',
            marginTop:'30px'
          }}
        >
          <div className="dashField">
            <div>
              <img src="/postJob.png" />
            </div>
            <div className="description">Create Job</div>
          </div>  
          <div className="dashField">
            <div>
            <img src="/jobPostingHistory.png"/>
            </div>
            <div className="description">Job Posting History</div>
          </div> 
      </div>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}  className="modal">
           <div className="form">
            <div className="title">Job No. 1</div>
            <div className="formData" style={{padding:'20px'}}>
                <div className="field">
                     <p>Country</p>
                     <div className="inputField">
                     <Form.Item>
                     <Select className="selectField"><Select.Option value="demo">Philippines</Select.Option></Select>
                     </Form.Item>
                     </div>
                </div>
                <div className="field">
                     <p>Language</p>
                     <div className="inputField">
                     <Form.Item>
                     <Select><Select.Option value="demo">English</Select.Option></Select>
                     </Form.Item>
                     </div>
                </div>
                <div className="field">
                     <p>Job Title</p>
                     <div className="inputField">
                     <Form.Item>
                     <Input />
                     </Form.Item>
                     </div>
                </div>
                <div className="field">
                     <p>Where would you like to advertise this job?</p>
                     <div className="inputField">
                     <Form.Item>
                     <Input />
                     </Form.Item>
                     </div>
                </div>
                <div style={{border:'1px solid #ACB9CB',width:'100%'}}></div>
                <div className="nextButton"style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',marginTop:'4rem'}} >
                <Button style={{background:'#355FD0',borderRadius:'10px',width: '100px',color:'#FFFFFF',fontStyle: 'normal',fontWeight: '700'}}>Next</Button>
                </div>
            </div>
           </div>
      </Modal>
    </>
  )
}

export default postJob