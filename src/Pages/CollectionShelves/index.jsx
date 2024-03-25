import React, { useState, useEffect, useRef } from "react";
import "./CollectionShelves.css";
import axios from "axios";
import Axios from "../../Services/axios";
import { toast } from 'react-toastify';

const CollectionShelves = () => {
	const [newShelf, setNewShelf] = useState({
		name: "",
		capacity: "",
		rowNums: "",
		rows: "",
	});
	const [deleteValues, setDeleteValues] = useState({
		name: "",
		capacity: "",
	});
	const [mode, setMode] = useState("add");
	const [selectedShelf, setSelectedShelf] = useState(null);
	const dummy = [
		{
			name: "Shelf A1",
			Packages_capacity: 5,
		},
		{
			name: "Shelf A2",
			Packages_capacity: 7,
		},
	];

	const [shelves, setShelves] = useState([]);
	const createShelfButtonRef = useRef(null);
	const handleChange = (e) => {
		setNewShelf({ ...newShelf, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (newShelf.name && newShelf.rowNums && newShelf.capacity) {
			Axios
				.post("/shelves/createShelves", {
					...newShelf,
					rows: 1,
				})
				.then((response) => {
					setNewShelf({ name: "", capacity: "", rowNums: "", rows: "" }); // Clear the form
					setTimeout(() => {
						getShelves();
					  }, 2000);
					toast.success("Shelf created Successfuly", {position: 'top-right',});
				})
				.catch((error) => {
					toast.error("Error creating shelf:", {position: 'top-right',});
				});
		} else {
			toast.warning("All values not provided", {position: 'top-right',});
		}
	};

	const handleDelete = (shelfName, shelfCapacity) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this shelf?");
		if (confirmDelete) {
			Axios
				.post("/shelves/deleteShelves", {
					name: shelfName,
					capacity: shelfCapacity,
				})
				.then((response) => {
					getShelves();
					toast.success("Shelf deleted successfully", {position: 'top-right',});

				})
				.catch((error) => {
					console.error("Error deleting shelf:", error);
					toast.error("Error deleting shelf", {position: 'top-right',});

				});
		}
	};
	const getShelves = () => {
		Axios.get("/shelves/getShelves")
			.then((res) => {
				  setShelves(res.data);
			})
			.catch((err) => {
				console.log("Error");
				setShelves(dummy);
			});
	};
	const handleEdit = (shelf) => {
		shelf.preventDefault();

		if (newShelf.name && newShelf.rowNums && newShelf.capacity) {
			Axios
			.post("/shelves/deleteShelves", {
				name: deleteValues.name,
				capacity: deleteValues.capacity,
			}).then(()=>{

				Axios
				.post("/shelves/createShelves", {
					...newShelf,
					rows: 1,
				})
			})
				.then((response) => {
					setNewShelf({ name: "", capacity: "", rowNums: "", rows: "" });
					setDeleteValues({name: "", capacity: ""})
					toast.success("Shelf Edited Successfuly", {position: 'top-right',});
					setTimeout(() => {
						getShelves();
					  }, 2000);
				})
				.catch((error) => {
					toast.error("Error creating shelf:", {position: 'top-right',});
				});
		} else {
			toast.warning("All values not provided", {position: 'top-right',});
		}
	};
	useEffect(() => {
		getShelves();
	}, []);
	const sortedShelves = shelves.sort((a, b) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) {
		  return -1;
		}
		if (nameA > nameB) {
		  return 1;
		}
		return 0;
	  });
	return (
		<div className="main-wrapper">
			<div className="container-fluid">
				<div className="card">
					<div className="card-body">
						<div className="page-container">
							{/* <div className="page-heading">Shelves</div> */}
							<div className="row">
								<div className="col-xs-12">
									<button
										className="btn add"
										style={{ margin: "0 0 1rem 0" }}
										data-toggle="modal"
										data-target="#shelfModalCenter"
										ref={createShelfButtonRef}
									>
										Create Shelf
									</button>
								</div>
								<div
									class="modal fade"
									id="shelfModalCenter"
									tabindex="-1"
									role="dialog"
									aria-labelledby="shelfModalCenterTitle"
									aria-hidden="true"
								>
									<div class="modal-dialog modal-dialog-centered" role="document">
										<div class="modal-content">
											<div class="modal-header">
												<h5 class="modal-title" id="exampleModalLongTitle">
													Create a shelf
												</h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div class="modal-body row">
												<div className="col-md-6 col-xs-12 form-field">
													<label>Package Size:</label>
													<select
														name="capacity"
														value={newShelf.capacity}
														onChange={handleChange}
														required
														style={{ padding: "0.5rem", width: "80%" }}
													>
														<option value="">Select Package Size</option>
														<option value="Very Small">Very Small</option>
														<option value="Small">Small</option>
														<option value="Medium">Medium</option>
														<option value="Large">Large</option>
														<option value="Very Large">Very Large</option>
														<option value="Owings">Owings</option>
														<option value="Fridge">Fridge</option>
														<option value="CD">CD</option>
														<option value="CD+fridge">CD+fridge</option>
													</select>
												</div>
												<div className="col-md-6 col-xs-12 form-field">
													<label> Shelf Capacity</label>
													<input
														type="number"
														name="rowNums"
														required
														value={newShelf.rowNums}
														onChange={handleChange}
													/>
												</div>
												<div className="col-md-6 col-xs-12 form-field">
													<label>Shelf Name:</label>
													<input
														type="text"
														name="name"
														required
														value={newShelf.name}
														onChange={handleChange}
													/>
												</div>
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-light" data-dismiss="modal">
													Close
												</button>
												<button
													type="button"
													class="btn save"
													data-dismiss="modal"
													onClick={(e) => {
														mode === "add" ? handleSubmit(e) : handleEdit(e);
													}}
												>
													Save
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-xs-12">
									<table className="table table-bordered w-100">
										<thead>
											<tr>
												<th>Name</th>
												<th>Package Capacity</th>
												<th>Occupied</th>
												<th>Remaining</th>
												<th>Package size</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{sortedShelves.map((shelf) => (
												<tr>
													<td>{shelf.name}</td>
													<td>{shelf.Packages_capacity}</td>
													<td>{shelf.occupied_capacity}</td>
													<td>{shelf.remaining_capacity}</td>
													<td>{shelf?.capacity}</td>
													<td>
														<button
															className="btn update btn-sm"
															style={{ marginRight: "1rem" }}
															data-toggle="modal"
															data-target="#shelfModalCenter"
															onClick={() => {
																setNewShelf({
																	name: shelf.name,
																	rowNums: shelf.Packages_capacity,
																	capacity: shelf.capacity,
																});
																setDeleteValues({
																	name: shelf.name,
																	capacity: shelf.capacity
																})
																setSelectedShelf(shelf);
																setMode("edit");
															}} // Call handleEdit with the selected shelf
														>
															Edit
														</button>
														<button
															className="btn delete btn-sm"
															onClick={() => handleDelete(shelf.name, shelf.capacity)}
														>
															Delete
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CollectionShelves;
