import { Players, Workspace, RunService, UserInputService } from "@rbxts/services";

const LocalPlayer = Players.LocalPlayer;

const Mouse = LocalPlayer.GetMouse();
const Part = Workspace.WaitForChild("Orange Block") as BasePart;
Mouse.TargetFilter = Workspace.WaitForChild("FilterIgnore") && Workspace.WaitForChild("Orange Block");

function calculateOffset() {
	const size = Part.ExtentsSize;
	return size.Y / 2;
}

RunService.RenderStepped.Connect((_deltaTime) => {
	let Position: Vector3;
	if (UserInputService.IsKeyDown(Enum.KeyCode.LeftShift)) {
		Position = new Vector3(math.round(Mouse.Hit.X), Mouse.Hit.Y + calculateOffset(), math.round(Mouse.Hit.Z));
	} else {
		Position = Mouse.Hit.Position.add(new Vector3(0, calculateOffset(), 0));
	}
	Part.Position = Position;
});
