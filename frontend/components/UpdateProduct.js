import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_PRODUCT_QUERY = gql`
  query GET_SINGLE_PRODUCT($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $price: Int
    $description: String
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $description
        price: $price 
      }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  // 1. Get the item that will be updated
  const queryData = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });
  
  // 2. Use mutation to update the item
  const [updateProduct, updateData] = useMutation(UPDATE_PRODUCT_MUTATION);

  
  // 3. We need the form handle the updates
  const { inputs, handleChange, clearForm, resetForm } = useForm(queryData.data?.Product);
  
  if (queryData.loading) return <p>Loading...</p>;

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        // TODO: handle the submit event
        const res = await updateProduct({
          variables: {
            id,
            name: inputs.name,
            price: inputs.price,
            description: inputs.description,
          }
        }).catch(console.error)
      }}
    >
      <DisplayError error={queryData.error || updateData.error } />
      <fieldset disabled={queryData.loading || updateData.loading} aria-busy={queryData.loading || updateData.loading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Update product</button>
      </fieldset>
    </Form>
  )
}
