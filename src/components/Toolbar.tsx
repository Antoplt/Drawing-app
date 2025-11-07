import './Toolbar.css'
import { useEffect, useState, type JSX } from "react";
import { PersistentElements } from '../core/PersistentElements.ts';
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { setFillStyle, setStrokeStyle, setLineWidth } from '../store/slices/toolbarSlice.ts';
import { removeItem, duplicateItem, setSelectedItemFillStyle, 
	setSelectedItemStrokeStyle, setSelectedItemLineWidth } from '../store/slices/canvasSlice.ts';
import type { ModeName } from '../core/mode/modeTypes.ts';


function Toolbar({persistentElements, currentModeName, setMode}:
				{persistentElements: PersistentElements | null,
				currentModeName: ModeName | null,
				setMode: (modeName: ModeName) => void
				}): JSX.Element {

	const dispatch = useAppDispatch();
	
  	const fillStyle = useAppSelector((state) => state.toolbar.fillStyle);
	const strokeStyle = useAppSelector((state) => state.toolbar.strokeStyle);
	const lineWidth = useAppSelector((state) => state.toolbar.lineWidth);

	const selectedItemId = useAppSelector((state) => state.canvas.selectedItemId);
	const items = useAppSelector((state) => state.canvas.items);
	
	// State to manage whether fill color input is enabled
	const [isFillable, setIsFillable] = useState<boolean>(false);

	// Update toolbar styles when selected item changes
	useEffect(() => {
		const selectedItem = items.find(item => item.id === selectedItemId);
		if (selectedItem) {
			dispatch(setFillStyle(selectedItem.fillStyle));
			dispatch(setStrokeStyle(selectedItem.strokeStyle));
			dispatch(setLineWidth(selectedItem.lineWidth));
		}
	}, [selectedItemId]);

	// Update whether fill color input is enabled based on current mode and selected item
	useEffect(() => {
		const selectedItem = items.find(item => item.id === selectedItemId);
		setIsFillable(
			currentModeName !== 'Path' && currentModeName !== 'Line' 
			&& selectedItem?.type !== 'Line' && selectedItem?.type !== 'Path'
		);
	}, [currentModeName, selectedItemId]);

	function fillStyleHandle() {
		const value = (document.getElementById("background-color") as HTMLInputElement).value;
		// Update toolbar's fillstyle value in both Redux store and PersistentElements
		dispatch(setFillStyle(value));
		persistentElements?.setFillStyle(value);
		// Also update selected item's fillstyle in both Redux store and PersistentElements
		dispatch(setSelectedItemFillStyle(value));
		persistentElements?.setSelectedItemFillStyle(value);
	}

	function outlineColorHandle() {
		const value = (document.getElementById("foreground-color") as HTMLInputElement).value;
		dispatch(setStrokeStyle(value));
		persistentElements?.setStrokeStyle(value);
		dispatch(setSelectedItemStrokeStyle(value));
		persistentElements?.setSelectedItemStrokeStyle(value);
	}

	function lineWidthHandle() {
		const value = parseInt((document.getElementById("line-width") as HTMLInputElement).value);
		dispatch(setLineWidth((value)));
		persistentElements?.setLineWidth(value);
		dispatch(setSelectedItemLineWidth(value));
		persistentElements?.setSelectedItemLineWidth(value);
	}

	function selectMoveRadioHandle() {
		setMode("SelectMove");
	}

	function pencilRadioHandle() {
		setMode("Path");
	}

	function lineRadioHandle() {
		setMode("Line");
	}

	function rectangleRadioHandle() {
		setMode("Rectangle");
	}

	function ellipseRadioHandle() {
		setMode("Ellipse");
	}

	function deleteHandle() {
		if (selectedItemId) {
			// Remove from Redux store and PersistentElements
      		dispatch(removeItem(selectedItemId));
			persistentElements?.removeSelectedItem();
		}
	}

	function duplicateHandle() {
		if (selectedItemId) {
			// Duplicate in Redux store and PersistentElements
      		dispatch(duplicateItem(selectedItemId));
			persistentElements?.duplicateSelectedItem();
		}
	}


	return (
	<div id="toolbar">
		<fieldset>
			<legend>Tools</legend>
			<div>
				<input type="radio" id="move" name="tool" value="move" defaultChecked 
				onClick={selectMoveRadioHandle}/>
				<label htmlFor="move">Select&Move</label>
			</div>
			<div>
				<input type="radio" id="pencil" name="tool" value="pencil" 
				onClick={pencilRadioHandle}/>
				<label htmlFor="pencil">Pencil</label>
			</div>
			<div>
				<input type="radio" id="line" name="tool" value="line" 
				onClick={lineRadioHandle}/>
				<label htmlFor="line">Line</label>
			</div>
			<div>
				<input type="radio" id="rectangle" name="tool" value="rectangle"
				onClick={rectangleRadioHandle}/>
				<label htmlFor="rectangle">Rectangle</label>
			</div>
			<div>
				<input type="radio" id="ellipse" name="tool" value="ellipse" 
				onClick={ellipseRadioHandle}/>
				<label htmlFor="ellipse">Ellipse</label>
			</div>
			</fieldset>
			<fieldset>
			<legend>Style</legend>
			<table>
				<tbody>
				<tr>
					<td>
					<label htmlFor="background-color">Fill color:</label>
					</td>
					<td>
					<input className='input-color' type="color" id="background-color" onChange={fillStyleHandle}
							value={isFillable ? fillStyle : "#000000"} 
							disabled={!isFillable}/>
					</td>
				</tr>
				<tr>
					<td>
					<label htmlFor="foreground-color">Outline:</label>
					</td>
					<td>
					<input className='input-color' type="color" id="foreground-color" 
							value={strokeStyle} onChange={outlineColorHandle}/>
					</td>
				</tr>
				<tr>
					<td>
					<label htmlFor="line-width">Line width:</label>
					</td>
					<td>
					<input className='input-width' type="number" id="line-width" min="0" max="10" 
							value={lineWidth} onChange={lineWidthHandle}/>
					</td>
				</tr>
				</tbody>
			</table>
			</fieldset>
			<fieldset className='actions-fieldset'>
			<legend>Actions</legend>
			<button id="delete-button" onClick={deleteHandle}
			disabled={selectedItemId==null}>Delete</button>
			<button id="clone-button" onClick={duplicateHandle}
			disabled={selectedItemId==null}>Clone</button>
			</fieldset>
	</div>
	);
}

export default Toolbar;