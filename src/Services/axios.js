import axios from "axios";

console.log(`${process.env.REACT_APP_BACKEND}`);

const Axios = axios.create({
	baseURL: `https://app.medtrakr.com`,
	// baseURL: `http://localhost:8000`,
	// headers: {
	// 	Authorization: `Bearer ${OAuth ? OAuth : ""}`,
	// },
});

export default Axios;
