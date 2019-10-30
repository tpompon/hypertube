import React, { createContext, Component } from "react"
import API from "controllers"

export const UserContext = createContext(true)

class Provider extends Component {

    state = {
        language: "en",
        search: "",
        avatar: "",
        updateAvatar: (avatar) => this.setState({ avatar }),
        updateSearch: (search) => this.setState({ search }),
        updateLanguage: (language) => this.setState({ language })
    }

    _isMounted = true

    componentDidMount() {
        this.fetchLanguage();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchLanguage = async () => {
        const res = await API.users.language.get();
        if (res && res.data.language && this._isMounted)
            this.setState({ language: res.data.language })
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
