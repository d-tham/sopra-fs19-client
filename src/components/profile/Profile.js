import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
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
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
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
class Profile extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            user: new User()
        };
    }


    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {
        let id = this.props.match.params.id;
        fetch(`${getDomain()}/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Token": localStorage.getItem('token')
            },
        })
            .then(response => response.json())
            .then(fetchedUser => {
                this.setState({user: fetchedUser})
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during viewing the profile: ${err.message}`);
                }
            });
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>{'Username: ' + this.state.user.username}</Label>
                        <Label>{'Status: ' + this.state.user.status}</Label>
                        <Label>{'Date of creation: ' + this.state.user.creationDate}</Label>
                        <Label>{'Date of birth: ' + this.state.user.birthDate}</Label>
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.redirectToGame();
                                }}
                            >
                                Return
                            </Button>
                            <Button
                                disabled = {localStorage.getItem('token') !== this.state.user.token}
                                width="50%"
                                onClick={() => {
                                    this.redirectToEditor();
                                }}
                            >
                                Edit Profile
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }

    /**
     * Redirecting to the game page.
     */
    redirectToGame() {
        this.props.history.push('/game');
    }

    /**
     * Redirecting to the edit profile page.
     */
    redirectToEditor() {
        this.props.history.push(`/user/${this.state.user.id}/profile/edit`);
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Profile);
