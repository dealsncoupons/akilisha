import React, { useState } from "react";

function AddEditItemForm() {

	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [publishDate, setPublishDate] = useState(new Date().toISOString().split("T")[0]);
	const [price, setPrice] = useState(0.0);
	const [description, setDecription] = useState("");
	const [tags, setTags] = useState([]);

	return (
		<form className="add-edit-item-container">
			<h2>Add a new item</h2>
			<div className="top-form-section">
				<label className="item-label input-label">
                    Item Name:
					<input
						type="text"
						required
						className="input-text"
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</label>
				<label className="item-label input-label">
                    Category:
					<select
						required
						className="select"
						value={category}
						onChange={e => setCategory(e.target.value)}
					>
						<option value="">Select a category</option>
						<option value="cars">Cars</option>
						<option value="trucks">Trucks</option>
						<option value="bikes">Bikes</option>
						<option value="motorcycle">Motor Cycles</option>
					</select>
				</label>
				<label className="item-label input-label">
                    Price:
					<input
						type="number"
						required
						className="input-text"
						value={price}
						onChange={e => setPrice(e.target.value)}
					/>
				</label>
				<label className="item-label input-label">
                    Description:
					<textarea
						required
						className="input-text description"
						value={description}
						onChange={e => setDecription(e.target.value)}
					></textarea>
				</label>
				<label className="item-label input-label">
                    Tags:
					<input
						type="text"
						required
						className="input-text"
						value={tags}
						onChange={e => setTags(e.target.value)}
					/>
				</label>
				<label className="item-label input-label">
                    Tags:
					<input
						type="date"
						required
						className="input-text"
						value={publishDate}
						onChange={e => setPublishDate(e.target.value)}
					/>
				</label>
			</div>
			<div className="items-list">
				<h3 className="text-center">Products List</h3>
				<table className="items-table">
					<thead>
						<tr>
							<th className="table-header"></th>
						</tr>
					</thead>
				</table>
			</div>
		</form>
	);
}

export default AddEditItemForm;