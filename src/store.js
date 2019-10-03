import React, { createContext, Component } from "react"

export const UserContext = createContext(true)

class Provider extends Component {

    state = {
        language: "fr",
        search: "",
        avatar: "",
        updateAvatar: (avatar) => this.setState({ avatar }),
        updateSearch: (search) => this.setState({ search }),
        updateLanguage: (language) => this.setState({ language })
    }
    
    render() {
        return (
            <UserContext.Provider value={ this.state }>
                { this.props.children }
            </UserContext.Provider>
        )
    }

}

export const UserConsumer = UserContext
export default Provider