'use client';
import { FormEvent, useState } from 'react';
import Header from '../header/page';
import { Form, Select, Progress } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Modal from 'react-modal'; 

type FormValues = {
    companyName: string;
    companyLogo: string;
    aboutCompany: string;
    industryType: string;
    numberOfEmployees: string;
    workSetup: string;
    email: string;
    mobileNumber: string;
    landlineNumber: string;
    address: string;
    street: string;
    town: string;
    city: string;
    pincode: string;
    country: string;
};


const initialFormValues: FormValues = {
    companyName: '',
    companyLogo: '',
    aboutCompany: '',
    industryType: '',
    numberOfEmployees:'',
    workSetup: '',
    email: '',
    mobileNumber: '',
    landlineNumber: '',
    address: '',
    street: '',
    town: '',
    city: '',
    pincode: '',
    country: '',
};

const Profile: React.FC = () => {
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
    const [activeStep, setActiveStep] = useState<number>(0);
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const [modalIsOpen, setModalIsOpen] = useState(false); // define modalIsOpen and setModalIsOpen
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Submitting form...');
        setModalIsOpen(true); // open the modal on form submission
    };
    const handleModal = () => {
        setModalIsOpen(!modalIsOpen);
    }


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };


    return (
        <>
            <Header></Header>
           
            <div className="containerProfile">
            <header>Tell us more about youself</header>
                <div className="progress">
                    <div className={`point ${activeStep === 1 ? 'active' : 'active'}`}>
                        <br></br><b>Company Details</b></div>
                    <div className="line"></div>
                    <div className={`point ${activeStep === 2 ? 'active' : ''}`}><br></br><b>Settings</b></div>
                </div>
                

                <form onSubmit={handleSubmit}>
                    <div className="form first" style={{ width: '100%'}}>

                        <div className="details personal">
                            {/* <span className="title">Personal Details</span> */}
                            <div className="fields" style={{ display: 'flex', flexDirection: "row" }}>
                                <div className="input" style={{ display: 'flex', flexBasis: '15%' }}>
                                    <img src='userIcon.png' style={{ width: '15.938rem', height: '12.25rem' }}></img>
                                </div>
                                <div className='firstSection' style={{ display: 'flex', flexDirection: 'column', width: '50%', flexBasis: '35%', padding: '20px' }}>
                                    <div className="input-field" style={{ width: '100%' }}>
                                        <label>Company Name</label>
                                        <input type="text" placeholder="Enter Company name" value={formValues.companyName} onChange={(event) => setFormValues({...formValues, companyName: event.target.value})} required></input>
                                    </div>

                                    <div className="input-field" style={{ width: '100%' }}>
                                        <label>Company Logo</label>
                                        <input type="text" placeholder="" value={formValues.companyLogo} onChange={(event) => setFormValues({...formValues, companyLogo: event.target.value})} required></input>
                                    </div>
                                </div>
                                <div className="input-field" style={{ display: 'flex', flexBasis: '50%', width: '100%' }}>
                                    <label>About the Company</label>
                                    <input type="text" placeholder="Enter details about the company" value={formValues.aboutCompany} onChange={(event) => setFormValues({...formValues, aboutCompany: event.target.value})} required style={{ width: '100%', height: '8rem' }}></input>
                                </div>
                            </div>

                            <div className='secondRow' style={{ display: 'flex' }}>
                                <div className="input-field" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 8px' }}>
                                    <label>Type of Industry</label>
                                    <input type="text" placeholder="Enter type of Industry" value={formValues.industryType} onChange={(event) => setFormValues({...formValues, industryType: event.target.value})} required></input>
                                </div>

                                <div className="input-field" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 8px' }}>
                                    <label>No. of Employees</label>
                                    <input type="number" placeholder="Enter no. of employees" value={formValues.numberOfEmployees} onChange={(event) => setFormValues({...formValues, numberOfEmployees: event.target.value})} required></input>
                                </div>

                                <div className="input-field" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 8px' }}>
                                    <label>Work Setup</label>
                                    <input type="text" placeholder="Enter work type" value={formValues.workSetup} onChange={(event) => setFormValues({...formValues, workSetup: event.target.value})} required></input>
                                </div>
                            </div>

                        </div>

                        <div className="details ID">
                            <span className="title">Contact Details</span>

                            <div className="fields">
                                <div className="input-field">
                                    <label>Email</label>
                                    <input type="text" placeholder="Enter your email" value={formValues.email} onChange={(event) => setFormValues({...formValues, email: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>Mobile Number</label>
                                    <input type="number" placeholder="Enter mobile number" value={formValues.mobileNumber} onChange={(event) => setFormValues({...formValues, mobileNumber: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>Landline No.</label>
                                    <input type="number" placeholder="Enter Landline number"value={formValues.landlineNumber} onChange={(event) => setFormValues({...formValues, landlineNumber: event.target.value})} required></input>
                                </div>
                            </div>
                        </div>
                        <div className="details ID2">
                            <span className="title">Address</span>

                            <div className="fields">
                                <div className="input-field">
                                    <label>House No./Bldg/Apartment/Suite,etc.</label>
                                    <input type="text" placeholder="Enter your house details" value={formValues.address} onChange={(event) => setFormValues({...formValues, address: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>Street</label>
                                    <input type="text" placeholder="Enter street address" value={formValues.street} onChange={(event) => setFormValues({...formValues, street: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>Town/Brgy.</label>
                                    <input type="text" placeholder="Enter Town details" value={formValues.town} onChange={(event) => setFormValues({...formValues, town: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>City</label>
                                    <input type="text" placeholder="Enter City name" value={formValues.city} onChange={(event) => setFormValues({...formValues, city: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>ZipCode</label>
                                    <input type="number" value={formValues.pincode} placeholder="Enter Zip Code" onChange={(event) => setFormValues({...formValues, pincode: event.target.value})} required></input>
                                </div>

                                <div className="input-field">
                                    <label>Country</label>
                                    <select id="country" name="country" value={formValues.country} onChange={handleChange}  required>
                                        <option value="">Select a country</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>
                            </div>

                            <button className="nextBtn">
                                <span className="btnText" onClick={handleNext}>Next</span>
                                <i className="uil uil-navigator"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Modal isOpen={modalIsOpen} style={{
    overlay:  {
      borderRadius:'50px',
      width: "30%",
      height: "46%",
      textAlign: "center",
      alignItems:'center',
      position: 'absolute',
      top:'50%',
      left:'50%',
      transform:'translate(-50%,-50%)',
      padding:'10px',
      outline: 'none',
      boxShadow: 'none',
    },content:{
        backgroundColor:'none'
    }
  }}  onRequestClose={() => setModalIsOpen(false)}>
               <div className="popupModal flex flex-col items-center justify-center">
  <div className="flex flex-col items-center justify-center mb-4">
    <div className="flex items-center justify-center rounded-full mb-4">
      <img src='congrats.png' style={{width:'179px',height:'113px'}} />
    </div>
    <br />
    <h1 className="font-bold text-2xl text-[#4CAF50]">Awesome</h1>
    <br />
    <p className="text-[#2C3F58] text-center flex-grow" style={{paddingBottom:'50px'}}><b>You have sucessfully set-up your company</b></p>
    <button className="bg-blue-700 hover:bg-[#355FD0] text-[#FFFFFF] py-2 px-4 rounded" style={{width:'85%', position: 'absolute', bottom:5,margin:'2rem 0rem',borderRadius:'5px'}} onClick={() => setModalIsOpen(false)}>Continue</button>
  </div>
</div>

            </Modal>
        </>
    );
};

export default Profile;