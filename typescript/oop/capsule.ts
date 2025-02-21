class CartItem {
  #productId: number;
  #quantity: number;
  #addedAt: Date;
  get productId(): number {
    return this.#productId;
  }
  get addedAt(): Date {
    return this.#addedAt;
  }
  constructor(productId: number, quantity: number, addedAt: Date) {
    this.#productId = productId;
    this.#quantity = quantity;
    this.#addedAt = addedAt;
  }
}

class Cart {
  #cartItems: CartItem[];
  constructor(cartItems: CartItem[] = []) {
    this.#cartItems = cartItems;
  }

  findCartItem(productId: number) {
    return this.#cartItems.find((cartItem) => cartItem.productId === productId);
  }

  addCartItem(productId: number, quantity: number) {
    if (this.findCartItem(productId))
      throw new Error("同じ商品は登録できません。");

    this.#cartItems.push(new CartItem(productId, quantity, new Date()));
  }

  removeCartItem(productId: number) {
    const cartItemIndex = this.#cartItems.findIndex(
      (cartItem) => cartItem.productId === productId
    );

    if (cartItemIndex < 0) return;

    this.#cartItems.splice(cartItemIndex, 1);
  }

  latestCartItem() {
    return this.#cartItems.reduce((previous, current) => {
      if (current.addedAt.valueOf() > previous.addedAt.valueOf()) {
        return current;
      } else {
        return previous;
      }
    });
  }
}

const cart = new Cart();
console.log(cart);
console.log(cart.findCartItem(1));
console.log(cart.addCartItem(1, 10));
console.log(cart.findCartItem(1)?.addedAt);
cart.addCartItem(2, 20);
cart.addCartItem(3, 30);
cart.addCartItem(4, 40);
console.log(cart.findCartItem(2));
console.log(
  cart.removeCartItem(2),
  cart.findCartItem(1),
  cart.findCartItem(2),
  cart.findCartItem(3),
  cart.findCartItem(4)
);
