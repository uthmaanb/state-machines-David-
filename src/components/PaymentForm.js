import React from "react";
import { createMachine, interpret } from "xstate";

import fakePayment from "../utils/fakePayments";

const stateMachine = createMachine({
	initial: "idle",
	states: {
		idle: {
			on: {
				SUBMIT: "loading",
			},
		},

		loading: {
			invoke: {
				id: "doPayment",
				src: (context, event) => fakePayment(),
				onDone: {
					target: "success",
				},
				onError: {
					target: "error",
				},
			},
		},

		error: {
			on: {
				SUBMIT: "loading",
			},
		},

		success: {
			type: "final",
		},
	},
});

class PaymentForm extends React.Component {
	// idle, loading, success, error

	service = interpret(stateMachine).onTransition((current) => {
		console.log(current);
	});

	componentDidMount() {
		this.service.start();
	}

	componentWillUnmount() {
		this.service.stop();
	}

	handleSubmit = () => {
		console.log("Submitting");
		this.service.send("SUBMIT");
	};

	render() {
		return (
			<div className="form-container">
				<div className="form-header">
					<h2>State Machine Payment Form</h2>
				</div>

				<div className="form-body">
					<form>
						<div className="form-group">
							<label htmlFor="NameOnCard">Name on card</label>
							<input
								id="NameOnCard"
								className="form-control"
								type="text"
								maxLength="255"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="CreditCardNumber">Card number</label>
							<input
								id="CreditCardNumber"
								className="null card-image form-control"
								type="text"
							/>
						</div>
						<button
							id="PayButton"
							className="btn btn-block btn-success submit-button"
							type="button"
							onClick={this.handleSubmit}
						>
							<span className="submit-button-lock" />
							<span className="align-middle">Pay Now</span>
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default PaymentForm;
