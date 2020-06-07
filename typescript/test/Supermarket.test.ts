import { FakeCatalog } from "./FakeCatalog"
import { Product } from "../src/model/Product"
import { SupermarketCatalog } from "../src/model/SupermarketCatalog"
import { Receipt } from "../src/model/Receipt"
import { ShoppingCart } from "../src/model/ShoppingCart"
import { Teller } from "../src/model/Teller"
import { SpecialOfferType } from "../src/model/SpecialOfferType"
import { ProductUnit } from "../src/model/ProductUnit"
const approvals = require('approvals');
approvals.mocha();

let cart: ShoppingCart;

beforeEach(()=>{
    cart = new ShoppingCart();
})
describe('Supermarket', function () {
    describe('ThreeForTwo Discount', function () {
        const toothbrush: Product = new Product("toothbrush", ProductUnit.Each);
    
        const catalog: SupermarketCatalog = new FakeCatalog();
        catalog.addProduct(toothbrush, 0.99);
    
        const teller: Teller = new Teller(catalog);
        teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, toothbrush, 0);

        it('Buy three toothbrushes to get free one', function (this: any) {
            cart.addItemQuantity(toothbrush, 3);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy seven toothbrushes to get free two', function (this: any) {
            cart.addItemQuantity(toothbrush, 7);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy one toothbrush, no get any discount', function (this: any) {
            cart.addItemQuantity(toothbrush, 1);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });
    });
});