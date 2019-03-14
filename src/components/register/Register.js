import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
// import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 600px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Register extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            username: null,
            name: null,
            birthDate: null,
            password: null,
            confirmPassword: null,
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is created in the backend.
     */
    register() {
        fetch(`${getDomain()}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                name: this.state.name,
                birthDate: this.state.birthDate
            })
        })
            .then(response => response.json())

            .then(response => {
                if (response.status === 409) {
                    alert("The username was already taken.\nPlease choose a different username.")
                } else {
                    this.redirectToLogin();
                }
            })

            .catch(err => { // Catching the error
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the registration: ${err.message}`);
                }
            });
    }

    /**
     * Redirecting to the login page.
     */
    redirectToLogin() {
        this.props.history.push('/login');
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Username</Label>
                        <InputField
                            placeholder="Enter here..."
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Name</Label>
                        <InputField
                            placeholder="Enter here..."
                            onChange={e => {
                                this.handleInputChange("name", e.target.value);
                            }}
                        />
                        <Label>Date of Birth</Label>
                        <InputField
                            type="date"
                            placeholder="Enter here..."
                            onChange={e => {
                                this.handleInputChange("birthDate", e.target.value);
                            }}
                        />
                        <Label>Choose a Password</Label>
                        <InputField
                            placeholder="Enter here..."
                            onChange={e => {
                                this.handleInputChange("password", e.target.value);
                            }}
                        />
                        <Label>Confirm Password</Label>
                        <InputField
                            placeholder="Enter here..."
                            onChange={e => {
                                this.handleInputChange("confirmPassword", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username || !this.state.name || !this.state.password || !this.state.confirmPassword}
                                width="50%"
                                onClick={() => {
                                    if (this.state.password !== this.state.confirmPassword) {
                                        alert(`The passwords do not match! Please re-enter the passwords.`)

                                    } else {
                                        this.register()
                                    }
                                }}
                            >
                                Register
                            </Button>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.redirectToLogin();
                                }}
                            >
                                Login instead?
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Register);