/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. query the current user and see if they have sign in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this');
  }
  // 2. Query the current user's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      product: { id: productId },
    },
    resolveFields: 'id,quantity',
  });
  console.log("allCartItems", allCartItems);
  const [existingCartItem] = allCartItems;
  console.log("existingCartItem", existingCartItem);
  // 3. See if the current item is in their cart already
  // 4. if it is, increment 1
  if (existingCartItem) {
    console.log('this item is already in cart, increment by one');
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 4. if it is not, create new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    }
  })
}

export default addToCart;
