import React, { useState } from 'react';
import { Loader } from './components/Loader/Loader';
import { FileGettingResults } from './components/FileGettingResults/FileGettingResults';
import './App.css';

function App() {
	const [fileCalculationResult, setFileCalculationResult] = useState({
		minValue: null,
		maxValue: null,
		average: null,
		median: null,
		executionTime: null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [drag, setDrag] = useState(false);

	function dragStartHandler(e) {
		e.preventDefault();
		setDrag(true);
	}

	function dragLeaveHandler(e) {
		e.preventDefault();
		setDrag(false);
	}

	function onDropHandler(e) {
		e.preventDefault();
		setDrag(false);
		const files = e.dataTransfer.files;
		getFile(files);
	}

	const processFile = async (file) => {
		setIsLoading(true);

		const startTime = performance.now();

		const stream = file.stream();
		const reader = stream.pipeThrough(new TextDecoderStream()).getReader();

		let decoder = '';
		let minValue = Infinity;
		let maxValue = -Infinity;
		let sum = 0;
		let countNum = 0;
		let numbers = [];

		while (true) {
			const { value, done } = await reader.read();
			if (done) break;

			decoder += value;
			let lines = decoder.split('\n');
			decoder = lines.pop();

			for (let line of lines) {
				let numArray = line.split(',').map(Number);
				for (let num of numArray) {
					if (!isNaN(num)) {
						numbers.push(num);
						sum += num;
						countNum++;
						if (num < minValue) {
							minValue = num;
						}
						if (num > maxValue) {
							maxValue = num;
						}
					}
				}
			}
		}

		if (decoder) {
			let remainingNumbers = decoder.split(',').map(Number);
			for (let num of remainingNumbers) {
				if (!isNaN(num)) {
					numbers.push(num);
					sum += num;
					countNum++;
					if (num < minValue) {
						minValue = num;
					}
					if (num > maxValue) {
						maxValue = num;
					}
				}
			}
		}

		let median;
		numbers.sort((a, b) => a - b);
		if (countNum % 2 === 0) {
			median = (numbers[countNum / 2 - 1] + numbers[countNum / 2]) / 2;
		} else {
			median = numbers[Math.floor(countNum / 2)];
		}

		const endTime = performance.now();
		setFileCalculationResult({
			minValue,
			maxValue,
			average: sum / countNum,
			median,
			executionTime: Math.ceil((endTime - startTime) / 1000),
		});
		setIsLoading(false);
	};

	const getFile = (files) => {
		const file = files[0];
		if (file) {
			processFile(file).catch((error) => {
				console.error('Error:', error);
				setIsLoading(false);
			});
		}
	};

	const handleFileInputChange = (event) => {
		getFile(event.target.files);
	};

	return (
		<div className="root">
			<div
				className="content"
				onDragStart={(e) => dragStartHandler(e)}
				onDragLeave={(e) => dragLeaveHandler(e)}
				onDragOver={(e) => dragStartHandler(e)}
				onDrop={(e) => onDropHandler(e)}>
				<input
					type="file"
					id="1000k"
					onChange={handleFileInputChange}
					readOnly
					accept=".txt"
				/>

				<label
					className={drag ? 'drop' : ''}
					htmlFor="1000k"
					title="click or drag file to upload">
					{drag ? 'Drop the File to Download' : 'Click or Drag File to Upload'}
				</label>
				{isLoading ? (
					<Loader />
				) : (
					<FileGettingResults {...fileCalculationResult} />
				)}
			</div>
		</div>
	);
}

export default App;
