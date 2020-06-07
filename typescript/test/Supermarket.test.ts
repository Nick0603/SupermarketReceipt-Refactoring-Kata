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

    describe('TenPercentDiscount Discount', function () {
        const rice: Product = new Product("rice", ProductUnit.Kilo);
    
        const catalog: SupermarketCatalog = new FakeCatalog();
        catalog.addProduct(rice, 2.49);
    
        const teller: Teller = new Teller(catalog);

        it('Buy 1 kilo rice, when 10% discount is not active.', function (this: any) {
            cart.addItemQuantity(rice, 3);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 1 kilo rice, when 10% discount is active.', function (this: any) {
            teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, rice, 10);
            cart.addItemQuantity(rice, 3);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });
    });

    describe('FiveForAmount Discount', function () {
        const toothbrush: Product = new Product("toothbrush", ProductUnit.Each);
    
        const catalog: SupermarketCatalog = new FakeCatalog();
        catalog.addProduct(toothbrush, 1.79);
    
        const teller: Teller = new Teller(catalog);
        teller.addSpecialOffer(SpecialOfferType.FiveForAmount, toothbrush, 7.49);

        it('Buy 4 toothbrushes', function (this: any) {
            cart.addItemQuantity(toothbrush, 4);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 5 toothbrushes', function (this: any) {
            cart.addItemQuantity(toothbrush, 5);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 6 toothbrushes', function (this: any) {
            cart.addItemQuantity(toothbrush, 6);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 13 toothbrushes', function (this: any) {
            cart.addItemQuantity(toothbrush, 13);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });
    });

    describe('TwoForAmount Discount', function () {
        const tomato: Product = new Product("tomato", ProductUnit.Kilo);
    
        const catalog: SupermarketCatalog = new FakeCatalog();
        catalog.addProduct(tomato, 0.69);
    
        const teller: Teller = new Teller(catalog);
        teller.addSpecialOffer(SpecialOfferType.TwoForAmount, tomato, 0.99);

        it('Buy 1 kilo of tomato', function (this: any) {
            cart.addItemQuantity(tomato, 1);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 2 kilo of tomato', function (this: any) {
            cart.addItemQuantity(tomato, 2);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 3 kilo of tomato', function (this: any) {
            cart.addItemQuantity(tomato, 3);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });

        it('Buy 7 kilo of tomato', function (this: any) {
            cart.addItemQuantity(tomato, 7);
            const receipt: Receipt = teller.checksOutArticlesFrom(cart);
            this.verifyAsJSON(receipt)
        });
    });
});