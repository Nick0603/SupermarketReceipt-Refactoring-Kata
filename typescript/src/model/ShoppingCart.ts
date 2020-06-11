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

type DiscountCalculator = {unitPrice: number, quantityAsInt: number, argument?: number}

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
        let discountDescription = '';
        let discountAmount = 0;
        if (offer.offerType == SpecialOfferType.ThreeForTwo) {
            discountDescription = "3 for 2";
            discountAmount = this.calcDiscountByThreeForTwo({unitPrice, quantityAsInt});
        }
        if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
            discountDescription = offer.argument + "% off";
            discountAmount = this.calcDiscountByTenPercentDiscount({unitPrice, quantityAsInt, argument: offer.argument});
        }
        if (offer.offerType == SpecialOfferType.TwoForAmount && quantityAsInt >= 2) {
            discountDescription = "2 for " + offer.argument;
            discountAmount = this.calcDiscountByTwoForAmount({unitPrice, quantityAsInt, argument: offer.argument});
        }
        if (offer.offerType == SpecialOfferType.FiveForAmount && quantityAsInt >= 5) {
            discountDescription = "5 for " + offer.argument;
            discountAmount = this.calcDiscountByFiveForAmount({unitPrice, quantityAsInt, argument: offer.argument});
        }
        if(discountAmount == 0){
            return null
        }
        return new Discount(product, discountDescription, discountAmount);
    }

    private calcDiscountByThreeForTwo({unitPrice, quantityAsInt}: DiscountCalculator): number {
        if (quantityAsInt < 3) {
            return 0;
        }
        const numberOfXs = Math.floor(quantityAsInt / 3);
        const discountAmount = quantityAsInt * unitPrice - ((numberOfXs * 2 * unitPrice) + quantityAsInt % 3 * unitPrice);
        return discountAmount;
    }

    private calcDiscountByTenPercentDiscount({unitPrice, quantityAsInt, argument: percentOff}: DiscountCalculator): number {
        return quantityAsInt * unitPrice * Number(percentOff) / 100.0;
    }

    private calcDiscountByTwoForAmount({unitPrice, quantityAsInt, argument: appointedAmount}: DiscountCalculator): number {
        const originTotal = unitPrice * quantityAsInt;
        const realTotal = appointedAmount && appointedAmount * Math.floor(quantityAsInt / 2) + quantityAsInt % 2 * unitPrice;
        const discountAmount = originTotal - Number(realTotal);
        return discountAmount;
    }

    private calcDiscountByFiveForAmount({unitPrice, quantityAsInt, argument: appointedAmount}: DiscountCalculator): number {
        const numberOfXs = Math.floor(quantityAsInt / 5);
        const discountAmount = unitPrice * quantityAsInt - (Number(appointedAmount) * numberOfXs + quantityAsInt % 5 * unitPrice);
        return discountAmount;
    }


}
