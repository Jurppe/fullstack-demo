import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => (
  <NavStyles>
    <Link href="/">Home</Link>
    <Link href="/products">Products</Link>
    <Link href="/orders">Orders</Link>
    <Link href="/sell">Sell</Link>
    <Link href="/account">Account</Link>
  </NavStyles>
);

export default Nav;
