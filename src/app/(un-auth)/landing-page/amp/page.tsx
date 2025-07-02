import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YAHSHUA HRIS AMP - Complete Employee Data Management & Job Posting System | YAHSHUA HRIS Features, Use Cases & Sync Employee Data',
  description: 'YAHSHUA HRIS AMP page offers comprehensive employee data management, job posting automation, and complete HR solutions. Discover YAHSHUA HRIS features, use cases, and seamlessly sync employee data with our DOLE-compliant HRIS platform for Philippine businesses.',
  keywords: 'yahshua hris, yahshua payroll, employee data, job posting, sync employee data, yahshua payroll features, use cases, use cases docs, HRIS Philippines, payroll management, employee management, DOLE compliance, AMP',
  other: {
    'amp': true
  }
};

const AMPLandingPage = () => {
  return (
    <html amp="true" lang="en">
      <head>
        <meta charSet="utf-8" />
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <title>YAHSHUA HRIS - Complete Job Posting & Employee Data Management System</title>
        <link rel="canonical" href="https://yahshuahris.com/landing-page" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <style amp-boilerplate="">{`
          body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}
        `}</style>
        <noscript>
          <style amp-boilerplate="">{`
            body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}
          `}</style>
        </noscript>
        <style amp-custom="">{`
          body { font-family: 'Golos Text', sans-serif; margin: 0; padding: 0; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .hero { background: linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #e6f2ff 100%); padding: 80px 0; text-align: center; }
          .hero h1 { font-size: 48px; font-weight: bold; color: #2C3F58; margin-bottom: 24px; line-height: 1.2; }
          .hero .highlight { color: #FFC107; }
          .hero p { font-size: 20px; color: #666; margin-bottom: 32px; max-width: 800px; margin-left: auto; margin-right: auto; }
          .cta-button { display: inline-block; background: #FFC107; color: black; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 8px; }
          .cta-button:hover { background: #e6ac00; }
          .section { padding: 80px 0; }
          .section-title { font-size: 36px; font-weight: bold; color: #2C3F58; text-align: center; margin-bottom: 24px; }
          .section-subtitle { font-size: 18px; color: #666; text-align: center; margin-bottom: 48px; max-width: 800px; margin-left: auto; margin-right: auto; }
          .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-bottom: 48px; }
          .feature-card { background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .feature-title { font-size: 20px; font-weight: bold; color: #2C3F58; margin-bottom: 16px; }
          .feature-description { color: #666; line-height: 1.6; margin-bottom: 16px; }
          .feature-list { list-style: none; padding: 0; }
          .feature-list li { color: #666; margin-bottom: 8px; padding-left: 16px; position: relative; }
          .feature-list li:before { content: "✓"; color: #FFC107; font-weight: bold; position: absolute; left: 0; }
          .bg-gray { background: #f8f9fa; }
          .bg-blue { background: linear-gradient(135deg, #e6f2ff 0%, #cde7ff 100%); }
          .text-center { text-align: center; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin-top: 48px; }
          .stat { text-align: center; }
          .stat-number { font-size: 36px; font-weight: bold; color: #FFC107; margin-bottom: 8px; }
          .stat-label { color: #666; }
          @media (max-width: 768px) {
            .hero h1 { font-size: 36px; }
            .hero p { font-size: 18px; }
            .section-title { font-size: 28px; }
            .container { padding: 0 16px; }
          }
        `}</style>
      </head>
      <body>
        <main>
          {/* Hero Section */}
          <section className="hero">
            <div className="container">
              <h1>
                YAHSHUA HRIS: Complete <br />
                <span className="highlight">Job Posting & Employee Data Management</span>
              </h1>
              <p>
                Transform your business with YAHSHUA HRIS - the complete job posting and employee data management system. 
                Seamlessly sync employee data, automate job posting across platforms, and discover powerful YAHSHUA Payroll features 
                with comprehensive use cases designed for Philippine businesses.
              </p>
              <a href="/register" className="cta-button">Start Your 30 Day Free Trial</a>
              <a href="#features" className="cta-button" style={{background: 'transparent', color: '#2C3F58', border: '2px solid #2C3F58'}}>
                See How It Works
              </a>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="section bg-gray">
            <div className="container">
              <h2 className="section-title">YAHSHUA HRIS: Employee Data & Job Posting Management</h2>
              <p className="section-subtitle">
                Everything you need to manage your human resources from recruitment to retirement. 
                Built specifically for Philippine businesses with local compliance in mind.
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <h3 className="feature-title">Job Posting & Management</h3>
                  <p className="feature-description">
                    Create job postings and launch across LinkedIn, Facebook, and YAHSHUA Jobs Portal. 
                    View and manage job posting history with status tracking.
                  </p>
                  <ul className="feature-list">
                    <li>Multi-platform posting</li>
                    <li>Job posting history</li>
                    <li>Status tracking</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="feature-title">Employee Data Management</h3>
                  <p className="feature-description">
                    Securely store all employee information from hire date. Automatic syncing capability 
                    for existing YAHSHUA Payroll users.
                  </p>
                  <ul className="feature-list">
                    <li>Secure data storage</li>
                    <li>YAHSHUA Payroll sync</li>
                    <li>Employee profiles</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="feature-title">DOLE Compliance Suite</h3>
                  <p className="feature-description">
                    Complete DOLE compliance including compensation logbooks, establishment registration, 
                    work accident reports, safety policies, and annual reporting.
                  </p>
                  <ul className="feature-list">
                    <li>Accident/illness reporting</li>
                    <li>Health and Safety documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Payroll Features Section */}
          <section className="section bg-blue">
            <div className="container">
              <h2 className="section-title">YAHSHUA Payroll Features: Complete Solution</h2>
              <p className="section-subtitle">
                Discover the comprehensive YAHSHUA payroll features that streamline your payroll operations. 
                From automated calculations to government compliance, our payroll system seamlessly integrates 
                with employee data management to provide a complete HRIS solution for Philippine businesses.
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <h3 className="feature-title">Advanced Payroll Processing</h3>
                  <p className="feature-description">
                    Experience seamless payroll management with YAHSHUA payroll features designed for Philippine businesses. 
                    Automated calculations, tax compliance, and comprehensive reporting.
                  </p>
                  <ul className="feature-list">
                    <li>Automated salary calculations</li>
                    <li>Government compliance</li>
                    <li>13th month pay calculations</li>
                    <li>Comprehensive reporting</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="feature-title">Employee Data Synchronization</h3>
                  <p className="feature-description">
                    Seamlessly sync employee data between HRIS and payroll systems. 
                    Real-time updates ensure accuracy and eliminate data entry errors.
                  </p>
                  <ul className="feature-list">
                    <li>Real-time data sync</li>
                    <li>Automatic updates</li>
                    <li>Centralized management</li>
                    <li>Data integrity validation</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="feature-title">Government Compliance</h3>
                  <p className="feature-description">
                    Ensure 100% compliance with Philippine labor laws and government requirements. 
                    Built-in compliance checks and automated reporting.
                  </p>
                  <ul className="feature-list">
                    <li>BIR compliance</li>
                    <li>SSS integration</li>
                    <li>PhilHealth management</li>
                    <li>Pag-IBIG processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="section">
            <div className="container">
              <h2 className="section-title">YAHSHUA HRIS Use Cases: Real-World Applications</h2>
              <p className="section-subtitle">
                Explore comprehensive use cases and documentation for YAHSHUA HRIS implementation. 
                Discover how our YAHSHUA payroll features, employee data management, and job posting 
                automation transform businesses across the Philippines.
              </p>
              
              <div className="features-grid">
                <div className="feature-card">
                  <h3 className="feature-title">Small to Medium Enterprises</h3>
                  <p className="feature-description">
                    Perfect for growing businesses that need comprehensive employee data management without complexity.
                  </p>
                  <ul className="feature-list">
                    <li>Streamlined employee data sync</li>
                    <li>Automated payroll processing</li>
                    <li>Multi-platform job posting</li>
                    <li>DOLE compliance reporting</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="feature-title">HR Departments & Teams</h3>
                  <p className="feature-description">
                    Empower your HR team with comprehensive tools for complete employee lifecycle management.
                  </p>
                  <ul className="feature-list">
                    <li>Applicant screening workflows</li>
                    <li>Performance evaluation system</li>
                    <li>Employee data synchronization</li>
                    <li>Benefits management</li>
                  </ul>
                </div>

                <div className="feature-card">
                  <h3 className="feature-title">YAHSHUA Payroll Integration Use Cases</h3>
                  <p className="feature-description">
                    Discover powerful YAHSHUA payroll features through real-world use cases and documentation.
                  </p>
                  <ul className="feature-list">
                    <li>Real-time data synchronization</li>
                    <li>Automated payroll calculations</li>
                    <li>System integrations</li>
                    <li>Detailed reporting</li>
                  </ul>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Government Compliant</div>
                </div>
                <div className="stat">
                  <div className="stat-number">Real-time</div>
                  <div className="stat-label">Employee Data Sync</div>
                </div>
                <div className="stat">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support & Training</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section bg-gray text-center">
            <div className="container">
              <h2 className="section-title">Ready to Transform Your HR Operations?</h2>
              <p className="section-subtitle">
                Join thousands of Philippine businesses already using YAHSHUA HRIS for complete employee management, 
                employee data synchronization with YAHSHUA Payroll, and automated job posting. Start your free trial today.
              </p>
              <a href="/register" className="cta-button">Start 30-Day Free Trial</a>
              <a href="/contact" className="cta-button" style={{background: 'transparent', color: '#2C3F58', border: '2px solid #2C3F58'}}>
                Contact Sales
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
};

export default AMPLandingPage;