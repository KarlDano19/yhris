"use client"
import Link from "next/link";
import { 
  DocumentTextIcon, 
  FolderIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

const EmployeeDocumentationContent = () => {
  const features = [
    {
      icon: CloudArrowUpIcon,
      title: "Digital Document Storage",
      description: "Secure cloud-based storage for all employee documents with easy upload, organization, and access controls."
    },
    {
      icon: FolderIcon,
      title: "Organized Document Management",
      description: "Structured categorization and filing system based on the employee's journey that helps organize documents systematically."
    },
    {
      icon: MagnifyingGlassIcon,
      title: "Document Organization & Access",
      description: "Organized filing system based on the employee's journey to easily locate and access documents."
    },
    {
      icon: ShieldCheckIcon,
      title: "Compliance & Security",
      description: "Ensure data privacy compliance with encrypted storage, access logs, and retention policy management."
    }
  ];

  const documentTypes = [
    {
      category: "Personal Records",
      documents: [
        "Employee Personal Information",
        "Emergency Contact Details",
        "Government IDs and Licenses",
        "Educational Certificates"
      ]
    },
    {
      category: "Employment Documents",
      documents: [
        "Employment Contracts",
        "Job Descriptions",
        "Offer Letters",
        "Non-Disclosure Agreements"
      ]
    },
    {
      category: "Performance Records",
      documents: [
        "Performance Evaluations",
        "Training Certificates",
        "Disciplinary Actions",
        "Achievement Awards"
      ]
    },
    {
      category: "Compliance Documents",
      documents: [
        "Tax Forms (BIR 2316)",
        "SSS/PhilHealth Records",
        "Safety Training Certificates",
        "Medical Clearances"
      ]
    }
  ];

  const workflowSteps = [
    {
      step: "Upload",
      description: "Drag and drop or batch upload documents with easy categorization.",
      icon: CloudArrowUpIcon
    },
    {
      step: "Organize",
      description: "Structured filing system helps sort and tag documents efficiently.",
      icon: FolderIcon
    },
    {
      step: "Access",
      description: "Role-based access ensures only authorized personnel can view documents.",
      icon: ShieldCheckIcon
    },
    {
      step: "Retrieve",
      description: "Easy document access and download with full audit trail tracking.",
      icon: DocumentArrowDownIcon
    }
  ];

  const businessStory = {
    title: "From Filing Cabinets to Digital Excellence",
    subtitle: "How Davao Construction Corp Modernized Document Management",
    challenge: "Davao Construction Corp had rooms full of filing cabinets, lost employee records, and compliance nightmares. Finding a single document took hours, and audits were stressful ordeals with missing paperwork.",
    solution: "YAHSHUA HRIS digitized their entire document system with secure cloud storage, organized filing structure, and systematic management that keeps everything compliant and accessible.",
    results: [
      "Eliminated physical filing rooms and storage costs",
      "Locate documents easily with organized filing system",
      "Remote access allows work from anywhere securely"
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-savoy-blue/10 p-4 rounded-2xl">
            <DocumentTextIcon className="h-12 w-12 text-savoy-blue" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-indigo-dye mb-6">
          Employee Documentation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Streamline document management with secure digital storage, intelligent organization, 
          and instant access to all employee records and compliance documents.
        </p>
      </div>

      {/* Business Story Section */}
      <div className="bg-gradient-to-br from-savoy-blue/5 to-indigo-50 rounded-2xl p-8 md:p-12 mb-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-dye mb-4">
            {businessStory.title}
          </h2>
          <p className="text-lg text-savoy-blue font-medium mb-2">
            {businessStory.subtitle}
          </p>
          <p className="text-xs text-gray-500 italic">
            *This is a fictional story for illustration purposes. Any resemblance to actual companies or persons is purely coincidental.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-lg font-semibold text-indigo-dye mb-3">The Challenge</h3>
            <p className="text-gray-600 mb-6">{businessStory.challenge}</p>
            
            <h3 className="text-lg font-semibold text-indigo-dye mb-3">The Solution</h3>
            <p className="text-gray-600">{businessStory.solution}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-dye mb-4">The Results</h3>
            <ul className="space-y-3">
              {businessStory.results.map((result, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Powerful Documentation Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="bg-savoy-blue/10 p-3 rounded-lg mr-4 flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-savoy-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-dye mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Types Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Comprehensive Document Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentTypes.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-dye mb-4 flex items-center">
                <FolderIcon className="h-5 w-5 text-savoy-blue mr-2" />
                {category.category}
              </h3>
              <ul className="space-y-2">
                {category.documents.map((doc, docIndex) => (
                  <li key={docIndex} className="flex items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-indigo-dye text-center mb-12">
          Document Management Workflow
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-savoy-blue/10 p-3 rounded-lg inline-block mb-4">
                  <IconComponent className="h-8 w-8 text-savoy-blue" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-dye mb-3">
                  {step.step}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Compliance Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-indigo-dye mb-6 flex items-center">
            <ShieldCheckIcon className="h-7 w-7 text-savoy-blue mr-3" />
            Security & Compliance
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">End-to-end encryption for all documents</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Data Privacy Act compliance</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Role-based access controls</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Complete audit trail logging</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Structured retention policy management</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-savoy-blue/10 to-indigo-100 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-indigo-dye mb-4 flex items-center">
            <UserGroupIcon className="h-6 w-6 text-savoy-blue mr-2" />
            Document Access Analytics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Document Storage</span>
              <div className="text-right">
                <div className="text-lg font-semibold text-indigo-dye">Secure</div>
                <div className="text-sm text-green-600">Cloud-based</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Document Access</span>
              <div className="text-right">
                <div className="text-lg font-semibold text-indigo-dye">Organized</div>
                <div className="text-sm text-blue-600">Structured</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Access Control</span>
              <div className="text-right">
                <div className="text-lg font-semibold text-indigo-dye">Protected</div>
                <div className="text-sm text-purple-600">Role-based</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-savoy-blue to-indigo-600 rounded-2xl p-12 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Go Paperless?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Transform your document management with our secure, intelligent employee documentation system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-[#FFC107] hover:bg-amber-600 text-black px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/use-cases"
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-medium transition-colors border border-white/30"
            >
              View All Use Cases
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentationContent;