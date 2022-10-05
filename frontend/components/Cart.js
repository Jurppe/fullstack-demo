/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import { useUser } from './User';
import FormatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import CloseButton from './styles/CloseButton';
import RemoveItemFromCart from './RemoveFromCart';
import { Checkout } from './Checkout';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

function useOutsideAlerter(ref, cartOpen, closeCart) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && cartOpen) {
        closeCart();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, cartOpen, closeCart]);
}

function CartItem({ cartItem }) {
  const { product, id } = cartItem;

  if (!product) return null;

  return (
    <CartItemStyles>
      <img
        width="100"
        src={product.photo.image.publicUrlTransformed}
        alt={product.name}
      />
      <div>
        <h3>{product.name}</h3>
        <em>
          Quantity: {cartItem.quantity} &times; {FormatMoney(product.price)}
        </em>
        <p>Total: {FormatMoney(product.price * cartItem.quantity)}</p>
      </div>
      <RemoveItemFromCart id={id} />
    </CartItemStyles>
  );
}

export default function Cart() {
  const me = useUser();
  const { cartOpen, closeCart } = useCart();
  // Create wrapper reference that detects clicks outside Cart component
  // When click outside the Cart component is detected change cartOpen state to false
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, cartOpen, closeCart);

  if (!me) return null;

  return (
    <CartStyles open={cartOpen} ref={wrapperRef}>
      <header>
        <Supreme>{me.name}'s Cart</Supreme>
      </header>
      <CloseButton type="button" onClick={closeCart}>
        Close
      </CloseButton>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>Cart's Total: {FormatMoney(calcTotalPrice(me.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}
