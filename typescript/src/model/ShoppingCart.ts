import { Product } from "./Product"
import { SupermarketCatalog } from "./SupermarketCatalog"
import * as _ from "lodash"
import { ProductQuantity } from "./ProductQuantity"
import { Discount } from "./Discount"
import { Receipt } from "./Receipt"
import { Offer } from "./Offer"
import { SpecialOfferType } from "./SpecialOfferType"

type ProductQuantities = { [productName: string]: ProductQuantity }
export type OffersByProduct = { [productName: string]: Offer };

export class ShoppingCart {

    private readonly items: ProductQuantity[] = [];
    _productQuantities: ProductQuantities = {};


    getItems(): ProductQuantity[] {
        return _.clone(this.items);
    }

    addItem(product: Product): void {
        this.addItemQuantity(product, 1.0);
    }

    productQuantities(): ProductQuantities {
        return this._productQuantities;
    }


    public addItemQuantity(product: Product, quantity: number): void {
        let productQuantity = new ProductQuantity(product, quantity)
        this.items.push(productQuantity);
        let currentQuantity = this._productQuantities[product.name]
        if (currentQuantity) {
            this._productQuantities[product.name] = this.increaseQuantity(product, currentQuantity, quantity);
        } else {
            this._productQuantities[product.name] = productQuantity;
        }

    }

    private increaseQuantity(product: Product, productQuantity: ProductQuantity, quantity: number) {
        return new ProductQuantity(product, productQuantity.quantity + quantity)
    }

    handleOffers(receipt: Receipt, offers: OffersByProduct, catalog: SupermarketCatalog): void {
        const productQuantities = this.productQuantities();
        for (const productName in productQuantities) {
            const { product, quantity } = productQuantities[productName];
            if (!offers[productName]) {
                continue;
            }
            const offer: Offer = offers[productName];
            const unitPrice: number = catalog.getUnitPrice(product);
            let discount: Discount | null = this.calcDiscount(product, offer, unitPrice, quantity)
            if (discount === null) {
                continue;
            }
            receipt.addDiscount(discount);
        }
    }

    private calcDiscount(product: Product, offer: Offer, unitPrice: number, quantityAsInt: number): Discount | null {
        let discount: Discount | null = null;
        let x = 1;
        if (offer.offerType == SpecialOfferType.ThreeForTwo) {
            x = 3;
        } else if (offer.offerType == SpecialOfferType.TwoForAmount) {
            x = 2;
        } if (offer.offerType == SpecialOfferType.FiveForAmount) {
            x = 5;
        }
        const numberOfXs = Math.floor(quantityAsInt / x);
        if (offer.offerType == SpecialOfferType.ThreeForTwo && quantityAsInt > 2) {
            const discountAmount = quantityAsInt * unitPrice - ((numberOfXs * 2 * unitPrice) + quantityAsInt % 3 * unitPrice);
            discount = new Discount(product, "3 for 2", discountAmount);
        }
        if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
            discount = new Discount(product, offer.argument + "% off", quantityAsInt * unitPrice * offer.argument / 100.0);
        }
        if (offer.offerType == SpecialOfferType.TwoForAmount && quantityAsInt >= 2) {
            const total = offer.argument * Math.floor(quantityAsInt / x) + quantityAsInt % 2 * unitPrice;
            const discountN = unitPrice * quantityAsInt - total;
            discount = new Discount(product, "2 for " + offer.argument, discountN);
        }
        if (offer.offerType == SpecialOfferType.FiveForAmount && quantityAsInt >= 5) {
            const discountTotal = unitPrice * quantityAsInt - (offer.argument * numberOfXs + quantityAsInt % 5 * unitPrice);
            discount = new Discount(product, "5 for " + offer.argument, discountTotal);
        }
        return discount;
    }
}
