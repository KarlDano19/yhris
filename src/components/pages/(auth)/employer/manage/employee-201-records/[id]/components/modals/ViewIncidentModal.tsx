"use client";

import { ReactNode } from "react";

import ModalLayout from "@/components/ModalLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import useGetDisciplinaryRecordDetail from "../../hooks/useGetDisciplinaryRecordDetail";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

interface ViewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number | null;
}

const statusLabel: Record<string, string> = {
  approved: "Approved",
  disapproved: "Disapproved",
  pending: "Pending",
};

const statusClass: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  disapproved: "bg-red-100 text-red-600",
  pending: "bg-yellow-100 text-orange-600",
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString() : "—";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm text-gray-900">{value || "—"}</p>
  </div>
);

const ViewIncidentModal = ({
  isOpen,
  onClose,
  recordId,
}: ViewIncidentModalProps) => {
  const { data, isFetching, error } = useGetDisciplinaryRecordDetail(recordId);

  return (
    <ModalLayout
      isOpen={isOpen}
      handleClose={onClose}
      title="Incident Details"
      maxWidth="max-w-3xl"
    >
      <div className="px-6 py-5">
        {isFetching && !data ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <LoadingSpinner
              size="lg"
              color="yellow"
              showText
              text="Loading incident details..."
            />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {(error as Error).message}
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Header row: NTE ID + status */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-sm text-gray-500">
                {data.nte_id || "NTE-000"}
              </p>
              <span
                className={`rounded-lg px-4 py-1.5 text-sm font-bold ${
                  statusClass[data.status] || statusClass.pending
                }`}
              >
                {statusLabel[data.status] || "Pending"}
              </span>
            </div>

            {/* Core details */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <DetailItem label="Employee" value={data.employee_name} />
              <DetailItem label="Issue Type" value={data.issue_type} />
              <DetailItem label="Position" value={data.position} />
              <DetailItem label="Department" value={data.department} />
              <DetailItem
                label="Incident Date"
                value={formatDate(data.incident_date)}
              />
              <DetailItem
                label="Place of Incident"
                value={data.place_of_incident}
              />
            </div>

            {/* Brief background */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Brief Background
              </p>
              <p className="mt-1 whitespace-pre-line rounded-md bg-gray-50 p-3 text-sm text-gray-900">
                {data.brief_background || "—"}
              </p>
            </div>

            {/* NTE / Decision progress */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <DetailItem
                label="NTE Status"
                value={
                  data.is_nte_received
                    ? "Received"
                    : data.is_nte_sent
                    ? "Sent"
                    : "Not Sent"
                }
              />
              <DetailItem
                label="NTE Received Date"
                value={formatDate(data.incident_received_date)}
              />
              <DetailItem
                label="Decision Status"
                value={
                  data.is_decision_received
                    ? "Received"
                    : data.is_decision_sent
                    ? "Sent"
                    : "Not Sent"
                }
              />
              <DetailItem
                label="Decision Received Date"
                value={formatDate(data.decision_received_date)}
              />
              <DetailItem label="Prepared By" value={data.prepared_by} />
              <DetailItem
                label="Employee Response"
                value={data.is_responded ? "Submitted" : "No Response Yet"}
              />
            </div>

            {/* Investigation decision */}
            {(data.investigation_decision ||
              data.investigation_custom_decision) && (
              <DetailItem
                label="Investigation Decision"
                value={
                  data.investigation_custom_decision ||
                  data.investigation_decision
                }
              />
            )}

            {/* Employee response text */}
            {data.response && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Response
                </p>
                <p className="mt-1 whitespace-pre-line rounded-md bg-gray-50 p-3 text-sm text-gray-900">
                  {data.response}
                </p>
              </div>
            )}

            {/* Attachments */}
            {(data.nte_attachment || data.decision_attachment) && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Attachments
                </p>
                <div className="flex flex-col gap-2">
                  {data.nte_attachment && (
                    <a
                      href={data.nte_attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-savoy-blue hover:underline"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                      NTE Document
                    </a>
                  )}
                  {data.decision_attachment && (
                    <a
                      href={data.decision_attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-savoy-blue hover:underline"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                      Decision Document
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-400">
            No incident details available.
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-gray-200 px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </ModalLayout>
  );
};

export default ViewIncidentModal;
