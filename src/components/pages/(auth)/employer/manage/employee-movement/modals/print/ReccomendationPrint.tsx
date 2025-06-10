"use client";

import { XCircleIcon } from "@heroicons/react/24/solid";

function ReccomendationPrint({
  onSubmit,
  approvals = [],
}: {
  onSubmit: any;
  approvals?: any[];
}) {

  return (
    <form onSubmit={onSubmit}>
      <div className="px-4 pt-4 pb-6">
        <div className={`hidden rounded-md bg-red-50 p-4 mb-3`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                You cannot proceed due to incomplete fields. Please review.
              </h3>
            </div>
          </div>
        </div>

        {/* Previous Approvals */}
        {approvals.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Approvals</h3>
            <div className="space-y-4">
              {approvals.map((approval, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{approval.approver_name}</p>
                      <p className="text-sm text-gray-600">{approval.approval_stage_name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      approval.status === 'not_started' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {approval.status === 'not_started' ? 'Pending' : approval.status}
                    </span>
                  </div>
                  {approval.recommendation && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Recommendation:</p>
                      <p className="text-sm text-gray-600">{approval.recommendation}</p>
                    </div>
                  )}
                  {approval.signature && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Signature:</p>
                      <img src={approval.signature} alt="Signature" className="h-12 mt-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default ReccomendationPrint;