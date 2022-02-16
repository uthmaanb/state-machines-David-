import React from "react";
import PaymentForm from "./components/PaymentForm";
// import { Machine } from "xstate";
import "./styles/App.css";

const App = () => {
	return (
		<div>
			<h2>Wekcome to the state machine</h2>
			<PaymentForm />
		</div>
	);
};

export default App;
