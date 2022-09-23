import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function SignOut() {
  const router = useRouter();

  const [signout] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSignout(event) {
    event.preventDefault();
    const res = await signout();
    router.push('/');
  }

  // eslint-disable-next-line react/button-has-type
  return <button onClick={handleSignout}>Sign out</button>;
}
