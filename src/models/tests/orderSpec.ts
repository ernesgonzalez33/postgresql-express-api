import { Order, OrderStore } from "../order";

const store = new OrderStore();

describe("Order Model", () => {
    it('should have a Current Order by User method', () => {
        expect(store.currentOrderByUser).toBeDefined();
    });
})