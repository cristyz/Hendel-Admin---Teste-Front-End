export interface IServicesRelatedsProdcts {
    RemoveProductOfRelateds(productDetailID: number, itemID: number): void,
    AddProductOfRelateds(event: React.FormEvent): void,
}