import UpdateProduct from '../components/UpdateProduct';

export const UpdatePage = ({ query }) => (
  <div>
    <UpdateProduct id={query.id} />
  </div>
);

export default UpdatePage;
