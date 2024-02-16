export type ProcessingType = "Smelted" | "Alloyed";

export type TItem = {
	itemId: string;
	displayName: string;
	stackSize: number;
	processingTypes?: Array<ProcessingType> | ProcessingType;
};

interface ItemsInterface {
	"Item.Ore.Iron": TItem;
}

export const Items: ItemsInterface = {
	"Item.Ore.Iron": {
		itemId: "ITEM",
		displayName: "Item",
		stackSize: 1,
		processingTypes: "Smelted",
	},
};
