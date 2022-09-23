import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import SignOut from './SignOut';

export default function Nav() {
  const user = useUser();
  return (
    <NavStyles>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      {user && (
        <>
          <Link href="/orders">Orders</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/account">Account</Link>
        </>
      )}
      {!user ? <Link href="/signin">Sign in</Link> : <SignOut />}
    </NavStyles>
  );
}
