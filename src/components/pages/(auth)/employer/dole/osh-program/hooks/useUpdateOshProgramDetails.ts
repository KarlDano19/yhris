import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { 
  applyFieldMappings, 
  formatDateFields, 
  handleBooleanFields, 
  populateFormData,
  handleErrorResponse,
  type OshProgramData 
} from "./utils/oshProgramUtils";

async function updateOshProgramDetails(data: OshProgramData) {
  try {
    // Get authentication token
    const token = getCookie("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Create a clean copy of the data
    const cleanData = { ...data };
    
    // Preprocess data
    applyFieldMappings(cleanData);
    formatDateFields(cleanData);
    handleBooleanFields(cleanData);

    // Create and populate FormData
    const formData = new FormData();
    populateFormData(formData, cleanData);

    // Send request
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/osh-programs/`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Token ${token}`
        },
        body: formData,
      }
    );

    // Handle response
    if (response.status === 401) {
      throw new Error("Authentication failed. Please log in again.");
    }

    if (!response.ok) {
      return handleErrorResponse(response);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    throw error;
  }
}

function useUpdateOshProgramDetails() {
  return useMutation({
    mutationFn: updateOshProgramDetails
  });
}

export default useUpdateOshProgramDetails;

