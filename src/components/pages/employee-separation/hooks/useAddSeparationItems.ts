import { T_Separation } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

async function addSeparation(
  separation: T_Separation,
) {
  try {
    const data = {
      employee: separation.name,
      position: separation.position,
      department: separation.department,
      date_of_separation: separation.date,
      reason_of_leaving: separation.reason,
    };
    const config = {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Token ${localStorage.token}`,
      },
    };
    const res = await axios.post(
      `${process.env.hostName}/api/separations/`,
      data,
      config
    );
    return res.data;
  } catch (err: any) {
    if (Object.hasOwn(err, 'response')) {
      throw err.response.data.message;
    }
    throw err.message;
  }
}

function useAddSeparationItems() {

  const query = useMutation(
    (separation: T_Separation) =>
    addSeparation(separation),
  );

  return query;
}

export default useAddSeparationItems;
