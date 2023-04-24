import React from "react";
import Header2 from "../../header2/page"
const jobPosting = () => {
  return (
    <>      
      <Header2></Header2>
      <div className="dashBody">
      <h1 style={{marginTop:'2rem',marginLeft:'5.3rem'}}>Dashboard</h1>
        <div
          className="upperDashboard"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            padding:'4rem'
          }}
        >
          <div className="dashField">
            <div>
              <img src="/postJob.png" />
            </div>
            <div className="description">Post a Job</div>
          </div>
          <div className="dashField">
            <div>
              <img src="/searchApplicant.png" />
            </div>
            <div className="description">Screen Applicants</div>
          </div>
          <div className="dashField">
            <div>
              <img src="/orinet.png" />
            </div>
            <div className="description">Orient</div>
          </div>
          <div className="dashField">
            <div>
              <img src="/manage.png" />
            </div>
            <div className="description">Manage</div>
          </div>
          <div className="dashField">
            <div>
              <img src="/train.png" />
            </div>
            <div className="description">Train</div>
          </div>
        </div>
        <div
          className="lowerDashboard"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            padding:'4rem'
          }}
        >
          <div className="dashField">
            <div>
              <img src="/payroll.png" />
            </div>
            <div className="description">Payroll</div>
          </div>

          <div className="dashField">
            <div>
              <img src="/employeeSeparation.png" />
            </div>
            <div className="description">Employee Separation</div>
          </div>

          <div className="dashField">
            <div>
               <img src="/employee.png" style={{position:'absolute',right:'120px',bottom:'150px'}}></img>
              <img src="/employeeKit.png" style={{marginBottom: '0px',marginTop: '-15px',marginRight: '11px'}}/>
            </div>
            <div className="description">Employee kit</div>
          </div>

          <div className="dashField">
            <div>
              <img src="/getHelp.png" />
            </div>
            <div className="description">Get Help</div>
          </div>

          <div className="dashField">
            <div>
              <img src="/settings.png" />
            </div>
            <div className="description">Settings</div>
          </div>

        </div>
      </div>
    </>
  );
};

export default jobPosting;
