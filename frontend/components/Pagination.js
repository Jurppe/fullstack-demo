import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta { count }
  }
`;

export default function Pagination({ page }) {
  // Fetch item count for pagination
  const { error, loading, data } = useQuery(PAGINATION_QUERY);

  // While fetching return 'Loading...', on error display error
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError>{error}</DisplayError>

  const { count } = data._allProductsMeta;
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>Sick Fits - Page {page} of {pageCount}</title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>← Prev</a>
      </Link>
      <p>Page {page} of {pageCount}</p>
      <p>{count} Items total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next →</a>
      </Link>
    </PaginationStyles>
  )
}