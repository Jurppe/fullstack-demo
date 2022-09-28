import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import SignOut from './SignOut';
import { useCart } from '../lib/cartState';

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();

  return (
    <NavStyles>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      {user && (
        <>
          <Link href="/orders">Orders</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/account">Account</Link>
          <button type="button" onClick={openCart}>
            My Cart
          </button>
        </>
      )}
      {!user ? <Link href="/signin">Sign in</Link> : <SignOut />}
    </NavStyles>
  );
}
