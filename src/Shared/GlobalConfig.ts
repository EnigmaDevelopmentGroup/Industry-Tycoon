type ConfigDataType = string | number | boolean;

interface ConfigInterface {
	EntityDebug: boolean;
}

const Config: ConfigInterface = {
	EntityDebug: true,
};

/**
 * Compares the value of a key in the Config object to an expected value, and runs a callback if they match.
 * @template T The type of the expected value.
 * @param {keyof ConfigInterface} key - The key to compare in the Config object.
 * @param {T} expect - The expected value to compare to.
 * @param {(key: keyof ConfigInterface) => void} [callback] - The callback to run if the values match.
 * @returns {boolean} True if the values match, false otherwise.
 */
export function configCompare<T extends ConfigDataType>(
	key: keyof ConfigInterface,
	expect: T,
	callback?: (key: keyof ConfigInterface) => void,
): boolean {
	const value = Config[key];
	if (value === expect) {
		callback?.(key);
		return true;
	}
	return false;
}
