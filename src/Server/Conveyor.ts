import { Workspace } from "@rbxts/services";
import { configCompare } from "Shared/GlobalConfig";

/**
 * @name Point
 * @description A point with a position and a color.
 */
class Point {
	public position: Vector3;
	public color: Color3;

	constructor(position: Vector3, color: Color3) {
		this.position = position;
		this.color = color;
	}
}

/**
 * @name BezierCurve
 * @description A Bezier curve with two anchor points and one control point.
 */
class BezierCurve {
	private anchorPoints: Point[];
	private controlPoint: Point;
	public cleanupRenderParts: Array<Part | MeshPart>;

	constructor(anchorPoints: Point[], controlPoint: Point) {
		this.anchorPoints = anchorPoints;
		this.controlPoint = controlPoint;
		this.cleanupRenderParts = [];
	}

	getPoints(): Point[] {
		const curvePoints: Point[] = [];

		const steps = 20;
		for (let step = 0; step < steps; step++) {
			const t = step / steps;

			// Calculate the position of the point on the curve
			const pointPosition = this.calculateBezierPoint(
				this.anchorPoints[0].position,
				this.controlPoint.position,
				this.anchorPoints[1].position,
				t,
			);

			// Create a Point with the calculated position and the color of the first anchor point
			const curvePoint = new Point(pointPosition, this.anchorPoints[0].color);

			curvePoints.push(curvePoint);
		}

		return curvePoints;
	}

	private calculateBezierPoint(p0: Vector3, p1: Vector3, p2: Vector3, t: number): Vector3 {
		const p01 = this.lerp(p0, p1, t);
		const p12 = this.lerp(p1, p2, t);

		return this.lerp(p01, p12, t);
	}

	private lerp(start: Vector3, _end: Vector3, t: number): Vector3 {
		const x = start.X + (_end.X - start.X) * t;
		const y = start.Y + (_end.Y - start.Y) * t;
		const z = start.Z + (_end.Z - start.Z) * t;

		return new Vector3(x, y, z);
	}
	public cleanupRender(): void {
		for (const part of this.cleanupRenderParts) {
			part.Parent = undefined;
		}
	}
	public getClosestPointOnCurve(point: Vector3): Vector3 {
		const curvePoints = this.getPoints();
		let closestPoint = curvePoints[0];
		let minDistance = point.sub(closestPoint.position).Magnitude;

		for (const curvePoint of curvePoints) {
			const dist = point.sub(curvePoint.position).Magnitude;
			if (dist < minDistance) {
				minDistance = dist;
				closestPoint = curvePoint;
			}
		}

		return closestPoint.position;
	}
}
/**
 * @name ConveyorPole
 * @description Connects to a Conveyor.
 */
export class ConveyorPole {
	public position: CFrame;
	public connectedBelts: Conveyor[] | undefined;

	constructor(position: CFrame, connectedBelts?: Conveyor[]) {
		this.position = position;
		this.connectedBelts = connectedBelts;
	}
}
/**
 * @name Conveyor
 * @description The physical belt between two or more ConveyorPoles.
 */
export class Conveyor {
	public conveyorPoles: ConveyorPole[];

	constructor(conveyorPoles: ConveyorPole[]) {
		this.conveyorPoles = conveyorPoles;
	}

	renderBelt(poles: ConveyorPole[]) {
		print("Start render");
		this.conveyorPoles = poles;
		const newPoints: Point[] = [];
		this.conveyorPoles.forEach((point: ConveyorPole) => {
			newPoints.push(new Point(point.position.Position, Color3.fromRGB(0, 0, 255)));
		});
		const bezier = new BezierCurve(newPoints, newPoints[3]);

		configCompare("EntityDebug", true, () => {
			bezier.getPoints().forEach((point: Point, index: number) => {
				const Part = new Instance("Part");
				Part.Name = "P" + index;
				Part.Position = point.position;
				Part.Anchored = true;
				Part.Size = new Vector3(0.5, 0.5, 0.5);
				Part.Color = point.color;
				Part.Material = Enum.Material.Neon;
				Part.Transparency = 0.5;
				Part.Parent = Workspace;
				bezier.cleanupRenderParts.push(Part);
			});
		});
		const curvePoints = bezier.getPoints();

		curvePoints.forEach((point: Point, index: number) => {
			// Calculate rotation for each mesh part

			const nextPoint = curvePoints[index + 1] || curvePoints[index];
			const direction = nextPoint.position.sub(point.position).Unit;
			const addedRotation = new CFrame(point.position, point.position.add(direction)).mul(
				CFrame.fromAxisAngle(new Vector3(0, 1, 0), math.rad(90)),
			);

			const Part = Workspace.WaitForChild("MeshPart").Clone() as MeshPart;
			Part.Name = "P" + index;
			Part.CFrame = addedRotation;
			Part.Anchored = true;
			const DistanceBetweenThisPointAndTheNext = bezier
				.getPoints()
				[index].position.sub(curvePoints[index + 1]?.position || curvePoints[index].position).Magnitude;
			Part.Size = new Vector3(DistanceBetweenThisPointAndTheNext, 1, 4);
			Part.Parent = Workspace;
			bezier.cleanupRenderParts.push(Part);
		});

		return bezier;
	}
}
