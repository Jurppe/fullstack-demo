/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
import { Session } from '../types';

const graphql = String.raw;
interface Arguments {
  token: string,
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. make sure the user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create an order!')
  };
  // 1.5 query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  });
  // 2. calc the total price
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  const amount = cartItems.reduce((tally: number, cartItem: CartItemCreateInput) => {
    return tally + cartItem.quantity * cartItem.product.price
  }, 0);
  // 3. create the charge with the stripe
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'eur',
    confirm: true,
    payment_method: token
  }).catch(error => {
    console.log(error);
    throw new Error(error.message);
  });
  console.log(charge);
  // 4. convert the cartItems to orderItems
  const orderItems = cartItems.map(cartItem => {
    console.dir(cartItem, { depth: null });
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    }
    return orderItem;
  });
  // 5. create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  });
  // 6. clean up any old cart items
  const cartItemIds = cartItems.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  });
  return order;
}

export default checkout;
