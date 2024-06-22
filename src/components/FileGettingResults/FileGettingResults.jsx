export const FileGettingResults = ({
	minValue,
	maxValue,
	average,
	median,
	executionTime,
}) => {
	return (
		<>
			{minValue !== null && <p>Min value: {minValue}</p>}
			{maxValue !== null && <p>Max value: {maxValue}</p>}
			{average !== null && <p>Average value: {average}</p>}
			{median !== null && <p>Median: {median}</p>}
			{executionTime !== null && (
				<p>Code execution time(sec): {executionTime}</p>
			)}
		</>
	);
};
