import { T_Separation } from '@/types/globals';
import { useMutation } from '@tanstack/react-query';

async function addSeparation(
  separation: T_Separation,
) {
  const res = await fetch(
    `/api/auth`,
    {
      method: 'POST',
      body: JSON.stringify(separation),
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return res.json();
}

function useAddSeparationItems() {

  const query = useMutation(
    (separation: T_Separation) =>
    addSeparation(separation),
  );

  return query;
}

export default useAddSeparationItems;
