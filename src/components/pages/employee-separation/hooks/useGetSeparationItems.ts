import { useQuery } from '@tanstack/react-query';

async function getSeparationItems() {
  const res = await fetch(
    `/api/employee-separation`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return res.json();
}

function useGetSeparationItems() {

  const query = useQuery(
    ['separationsItemCache'],
    () => getSeparationItems(),
    { keepPreviousData: true }
  );

  return query;
}

export default useGetSeparationItems;
