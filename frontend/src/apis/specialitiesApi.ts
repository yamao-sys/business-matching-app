import { paths } from '@/generated/specialities/apiSchema';
import createClient from 'openapi-fetch';

const client = createClient<paths>({
  baseUrl: 'http://localhost:8080/',
});

export const getSpecialities = async () => {
  const { data, error } = await client.GET('/specialities');
  if (error) {
    throw Error();
  }

  return {
    specialities: data?.specialities,
  };
};
