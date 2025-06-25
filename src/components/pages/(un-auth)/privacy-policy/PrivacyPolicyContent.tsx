"use client"
import { ShieldCheckIcon, DocumentTextIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";

const PrivacyPolicyContent = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-savoy-blue/10 p-4 rounded-2xl">
            <ShieldCheckIcon className="h-12 w-12 text-savoy-blue" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-dye mb-6">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
        </p>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="prose max-w-none">
          
          {/* Web and Mobile App Privacy Notice */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-4 flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-savoy-blue mr-2" />
              Web and Mobile App Privacy Notice
            </h2>
            <p className="text-gray-600 leading-relaxed">
              This Privacy Notice is for the YAHSHUA-ABBA mobile applications, enabling collection and processing of personal information.
            </p>
          </section>

          {/* Personal Information Collected */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Personal Information Collected and Manner of Collection
            </h2>
            <p className="text-gray-600 mb-4">Collected information includes:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Name</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Company Name</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Email Address</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Phone Number</span>
              </li>
            </ul>
            <p className="text-gray-600">
              Additional personal information may be collected as necessary for product/service delivery.
            </p>
          </section>

          {/* Basis, Use, and Purpose */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Basis, Use, and Purpose for Processing of Personal Information
            </h2>
            <p className="text-gray-600 mb-4">Purposes include:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Providing products and services</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Collecting customer feedback</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Improving product quality</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Developing new services</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Personalizing customer experience</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Marketing and promotion</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Ensuring legal compliance</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Addressing privacy rights requests</span>
              </li>
            </ul>
          </section>

          {/* Methods for Automated Access */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Methods for Automated Access
            </h2>
            <div className="bg-blue-50 border-l-4 border-savoy-blue p-6 rounded-r-lg">
              <p className="text-gray-700 italic">
                "We exclusively utilize tokens for user identification within our mobile application to facilitate authentication. We do not use any other cookies for this or for any other purpose."
              </p>
            </div>
          </section>

          {/* Disclosure of Personal Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Disclosure of Personal Information
            </h2>
            <p className="text-gray-600 mb-4">Personal information is shared only when:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Allowed under specific legal sections</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Essential for service delivery</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Meeting legal requirements</span>
              </li>
            </ul>
          </section>

          {/* Risks Involved */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Risks Involved
            </h2>
            <p className="text-gray-600">
              Risks include potential unauthorized collection, use, disclosure, or access to personal information.
            </p>
          </section>

          {/* Data Protection and Security Measures */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Data Protection and Security Measures
            </h2>
            <p className="text-gray-600 mb-4">Implemented measures include:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Access control policies</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">End-to-end encryption</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Security against external threats</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Technical protection for databases</span>
              </li>
            </ul>
          </section>

          {/* Storage and Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Storage and Retention
            </h2>
            <p className="text-gray-600">
              Files are stored with cloud-based providers, maintained only as long as necessary for specified purposes.
            </p>
          </section>

          {/* Disposal */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Disposal
            </h2>
            <p className="text-gray-600">
              Physical records are shredded, digital files anonymized to prevent unauthorized access.
            </p>
          </section>

          {/* Rights of a Data Subject */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Rights of a Data Subject
            </h2>
            <p className="text-gray-600 mb-4">Includes rights to:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Access personal information</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Request rectification</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Request erasure</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Object to processing</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-savoy-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-600">Data portability</span>
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-indigo-dye mb-6">
              Contact Information
            </h2>
            <div className="bg-gradient-to-r from-savoy-blue/10 to-indigo-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-indigo-dye mb-4">
                Data Protection Officer (DPO)
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-savoy-blue mr-3 flex-shrink-0 mt-1" />
                  <div className="text-gray-600">
                    <p>Unit #12 2F E-Max Building</p>
                    <p>Masterson Avenue, Upper Balulang</p>
                    <p>Cagayan de Oro City, Philippines 9000</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-savoy-blue mr-3 flex-shrink-0" />
                  <div className="space-x-4">
                    <a href="mailto:dpo@abba.works" className="text-savoy-blue hover:text-indigo-600 transition-colors">
                      dpo@abba.works
                    </a>
                    <a href="mailto:dpo@yahshuagroup.com" className="text-savoy-blue hover:text-indigo-600 transition-colors">
                      dpo@yahshuagroup.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <section className="text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                <strong>Date last updated:</strong> 05 January 2024
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;