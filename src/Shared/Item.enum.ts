export type ProcessingType = "Smelted" | "Alloyed";

export type TItem = {
	displayName: string;
	stackSize: number;
	processingTypes?: Array<ProcessingType> | ProcessingType;
};

interface ItemsInterface {
	"Item.Ore.Iron": TItem;
	"Item.Debug.Sphere": TItem;
}

export const Items: ItemsInterface = {
	"Item.Ore.Iron": {
		displayName: "Item",
		stackSize: 1,
		processingTypes: "Smelted",
	},
	"Item.Debug.Sphere": {
		displayName: "Test Sphere",
		stackSize: 10,
		processingTypes: "Smelted",
	},
};
